import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { runMigrations } from './migrate';
import { initDb, createTable as pgCreateTable } from './query';
import * as schema from './schema';

// Define globals for persistent connections across serverless function invocations
// Using var is required for global declarations in TypeScript
declare global {
  // eslint-disable-next-line no-var
  var __db_connection_pool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __db_migrations_applied: boolean | undefined;
}

export function getConnectionPool(): Pool {
  if (!global.__db_connection_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }

    let poolConfig: any = {
      connectionString: process.env.DATABASE_URL,
      max: 10, // Optimize for serverless
      idleTimeoutMillis: 30000,
    };

    if (process.env.NODE_ENV === 'development') {
      // In development, do NOT set the ssl property at all.
      // Many local Postgres servers do not support SSL.
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      if (process.env.NODE_ENV === 'development') {
        console.log(
          'Database connection pool created (persisted in global, no SSL for development)',
        );
      }
    } else if (
      process.env.NODE_ENV === 'production' &&
      process.env.IS_OCI !== 'true'
    ) {
      // In production, require SSL with CA cert
      if (!process.env.DATABASE_CA_CERT) {
        throw new Error('DATABASE_CA_CERT environment variable is not defined');
      }
      // Replace escaped newlines and ensure proper PEM format
      const caCert = process.env.DATABASE_CA_CERT.replace(/\\n/g, '\n').trim();
      poolConfig.ssl = {
        rejectUnauthorized: true,
        ca: caCert,
      };
    }

    global.__db_connection_pool = new Pool(poolConfig);
  }

  return global.__db_connection_pool;
}

// Initialize and export the db instance with schema for querying
const pool = getConnectionPool();
export const db: NodePgDatabase<typeof schema> = initDb(pool);

// Re-export schema and other specific utilities from ./query if needed
export { schema };
export { pgCreateTable };

/**
 * Initialize the database connection and run migrations.
 * This should return the schema-aware db instance.
 */
export async function initializeDB(): Promise<NodePgDatabase<typeof schema>> {
  try {
    // Get the connection pool
    const pool = getConnectionPool();

    // Test the connection
    await pool.query('SELECT NOW()');

    if (process.env.NODE_ENV === 'development') {
      console.log('Database connected successfully (global connection)');
    }

    // Run migrations only once
    if (!global.__db_migrations_applied) {
      await runMigrations(pool);
      global.__db_migrations_applied = true;
      console.log('Database migrations applied (tracked in global state)');
    }

    // Return the already initialized and typed 'db' instance from this module
    return db;
  } catch (error) {
    console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
  }
}

/**
 * Get the database connection for regular requests.
 * Returns the schema-aware db instance.
 */
export async function connectToDB(): Promise<NodePgDatabase<typeof schema>> {
  // If we haven't initialized yet, do the full initialization
  if (!global.__db_connection_pool || !global.__db_migrations_applied) {
    // Ensure initializeDB also uses/returns the same 'db' instance or a compatible one
    return initializeDB();
  }

  // Otherwise, just return the existing db connection
  // This should ideally return the same 'db' instance for consistency
  return db;
}
