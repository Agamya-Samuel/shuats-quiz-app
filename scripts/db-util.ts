import { exec } from 'child_process';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

import * as fs from 'fs';
import * as path from 'path';

const backupDir = path.join(process.cwd(), 'backups');

/**
 * Checks if docker is running.
 * @returns A promise that resolves to true if docker is running, false otherwise.
 */
function isDockerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    exec('docker info', (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * Creates a backup of the database using Docker.
 */
async function backupDatabase() {
  if (!(await isDockerRunning())) {
    console.error(
      'Error: Docker is not running. Please start Docker and try again.'
    );
    process.exit(1);
  }

  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    process.exit(1);
  }

  const url = new URL(DATABASE_URL);
  const PGHOST = url.hostname === 'localhost' ? 'host.docker.internal' : url.hostname;
  const PGPORT = url.port;
  const PGDATABASE = url.pathname.slice(1);
  const PGUSER = url.username;
  const PGPASSWORD = url.password;

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilePath = `/backups/backup-${timestamp}.sql`;

  const command = `docker run --rm -v "${path.resolve(backupDir)}:/backups" --network host -e PGPASSWORD=${PGPASSWORD} postgres:17-alpine pg_dump -h ${PGHOST} -p ${PGPORT} -U ${PGUSER} -d ${PGDATABASE} -F c -b -v -f ${backupFilePath}`;

  console.log('Starting database backup using Docker...');
  const child = exec(command);

  child.stdout?.on('data', (data) => {
    console.log(data);
  });

  child.stderr?.on('data', (data) => {
    console.error(data);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`Database backup completed successfully: ${path.join(backupDir, `backup-${timestamp}.sql`)}`);
      process.exit(0);
    } else {
      console.error(`Database backup failed with code ${code}`);
      process.exit(1);
    }
  });
}

/**
 * Restores the database from a backup file using Docker.
 * @param backupFile The path to the backup file.
 */
async function restoreDatabase(backupFile: string) {
  if (!(await isDockerRunning())) {
    console.error(
      'Error: Docker is not running. Please start Docker and try again.'
    );
    process.exit(1);
  }

  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    process.exit(1);
  }

  const url = new URL(DATABASE_URL);
  const PGHOST = url.hostname === 'localhost' ? 'host.docker.internal' : url.hostname;
  const PGPORT = url.port;
  const PGDATABASE = url.pathname.slice(1);
  const PGUSER = url.username;
  const PGPASSWORD = url.password;

  if (!fs.existsSync(backupFile)) {
    console.error(`Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  const backupFilePath = `/backups/${path.basename(backupFile)}`;

  const command = `docker run --rm -v "${path.resolve(path.dirname(backupFile))}:/backups" --network host -e PGPASSWORD=${PGPASSWORD} postgres:17-alpine pg_restore -h ${PGHOST} -p ${PGPORT} -U ${PGUSER} -d ${PGDATABASE} --no-owner --clean --if-exists ${backupFilePath}`;

  console.log(`Starting database restore from ${backupFile} using Docker...`);
  const child = exec(command);

  child.stdout?.on('data', (data) => {
    console.log(data);
  });

  child.stderr?.on('data', (data) => {
    console.error(data);
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('Database restore completed successfully.');
      process.exit(0);
    } else {
      console.error(`Database restore failed with code ${code}`);
      process.exit(1);
    }
  });
}

/**
 * Main function to parse arguments and execute the script.
 */
async function main() {
  const args = process.argv;

  if (args.includes('--backup')) {
    await backupDatabase();
  } else if (args.includes('--restore')) {
    const backupFileIndex = args.indexOf('--restore') + 1;
    if (backupFileIndex >= args.length || !args[backupFileIndex]) {
      console.error('Please provide the path to the backup file for restore.');
      process.exit(1);
    }
    const backupFile = args[backupFileIndex];
    await restoreDatabase(backupFile);
  } else {
    console.log('Usage:');
    console.log('  npm run script:db-util -- --backup');
    console.log('  npm run script:db-util -- --restore <path-to-backup-file>');
    process.exit(1);
  }
}

main();
