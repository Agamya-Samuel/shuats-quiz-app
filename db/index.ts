import { Pool } from 'pg';
import { runMigrations } from './migrate';
import { initDb } from './query';
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

		let sslConfig;
		if (process.env.NODE_ENV === 'development') {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
			sslConfig = {
				rejectUnauthorized: false,
			};
		} else {
			if (!process.env.DATABASE_CA_CERT) {
				throw new Error(
					'DATABASE_CA_CERT environment variable is not defined'
				);
			}
			// Replace escaped newlines and ensure proper PEM format
			const caCert = process.env.DATABASE_CA_CERT.replace(
				/\\n/g,
				'\n'
			).trim();
			sslConfig = {
				rejectUnauthorized: true,
				ca: caCert,
			};
		}

		global.__db_connection_pool = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: sslConfig,
			max: 10, // Optimize for serverless
			idleTimeoutMillis: 30000,
		});

		if (process.env.NODE_ENV === 'development') {
			console.log(
				'Database connection pool created (persisted in global)'
			);
		}
	}

	return global.__db_connection_pool;
}

// Re-export schema
export { schema };

// Export db for convenience
export * from './query';

/**
 * Initialize the database connection and run migrations.
 * This should be called only once during application startup.
 */
export async function initializeDB() {
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
			console.log(
				'Database migrations applied (tracked in global state)'
			);
		}

		// Initialize and return the db
		return initDb(pool);
	} catch (error) {
		console.error('Database connection failed:', error);

		// Graceful exit in case of a connection error
		process.exit(1);
	}
}

/**
 * Get the database connection for regular requests.
 * Uses the existing connection pool without re-running migrations.
 */
export async function connectToDB() {
	// If we haven't initialized yet, do the full initialization
	if (!global.__db_connection_pool || !global.__db_migrations_applied) {
		return initializeDB();
	}

	// Otherwise, just return the existing db connection
	return initDb(global.__db_connection_pool);
}
