import { Pool } from 'pg';
import { db } from './query';
import { runMigrations } from './migrate';

// Connection singleton
let connectionPool: Pool | null = null;

export function getConnectionPool(): Pool {
	if (!connectionPool) {
		if (!process.env.DATABASE_URL) {
			throw new Error('DATABASE_URL environment variable is not defined');
		}

		connectionPool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});

		if (process.env.NODE_ENV === 'development') {
			console.log('Database connection pool created');
		}
	}

	return connectionPool;
}

// Re-export db and schema from query.ts
export * from './query';

export async function connectToDB(): Promise<typeof db> {
	try {
		// Test the connection
		const pool = getConnectionPool();
		await pool.query('SELECT NOW()');

		if (process.env.NODE_ENV === 'development') {
			console.log('Database connected successfully');
		}

		// Run migrations to ensure the database schema is up to date
		await runMigrations();

		// Import db from query to ensure it's initialized
		const { db } = await import('./query');
		return db;
	} catch (error) {
		console.error('Database connection failed:', error);

		// Graceful exit in case of a connection error
		process.exit(1);
	}
}
