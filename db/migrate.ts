import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { getConnectionPool } from './index';

/**
 * Runs all migrations from the drizzle folder when the application starts
 * This ensures the database schema is up to date
 */
export async function runMigrations() {
	try {
		// Get the connection pool
		const pool = getConnectionPool();

		// Create a Drizzle instance
		const db = drizzle(pool);

		// Get the migration directory path
		const migrationsFolder = resolve(process.cwd(), 'drizzle');

		console.log(`Running migrations from ${migrationsFolder}`);

		// Run migrations
		await migrate(db, { migrationsFolder });

		// List applied migrations for logging purposes
		const migrations = await readdir(migrationsFolder).catch(() => []);
		console.log(`Applied ${migrations.length} migration(s)`);

		return { success: true };
	} catch (error) {
		console.error('Migration failed:', error);
		return { success: false, error };
	}
}
