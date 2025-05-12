import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	// driver: 'pglite',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/quizapp',
	},
	verbose: true,
	strict: true,
});
