import { Pool } from 'pg';
import { runMigrations } from './migrate';
import { initDb } from './query';
import * as schema from './schema';

// Connection singleton
let connectionPool: Pool | null = null;

export function getConnectionPool(): Pool {
	if (!connectionPool) {
		if (!process.env.DATABASE_URL) {
			throw new Error('DATABASE_URL environment variable is not defined');
		}

		let sslConfig;
		if (process.env.NODE_ENV === 'development') {
			process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
			sslConfig = {
				rejectUnauthorized: false, // Always allow self-signed certificates
			};
		} else {
			sslConfig = {
				rejectUnauthorized: true // Strict in production (if no CA provided)
			};
		}

		connectionPool = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: sslConfig
		});

		if (process.env.NODE_ENV === 'development') {
			console.log('Database connection pool created');
		}
	}

	return connectionPool;
}

// Re-export schema
export { schema };

// Export db for convenience
export * from './query';

export async function connectToDB() {
	try {
		// Get the connection pool
		const pool = getConnectionPool();
		
		// Test the connection
		await pool.query('SELECT NOW()');

		if (process.env.NODE_ENV === 'development') {
			console.log('Database connected successfully');
		}

		// Run migrations to ensure the database schema is up to date
		await runMigrations(pool);
		
		// Initialize the db with the pool
		const db = initDb(pool);
		
		return db;
	} catch (error) {
		console.error('Database connection failed:', error);

		// Graceful exit in case of a connection error
		process.exit(1);
	}
}
