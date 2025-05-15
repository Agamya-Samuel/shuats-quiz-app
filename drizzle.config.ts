// Load environment variables from .env.local
import 'dotenv/config';
import * as dotenv from 'dotenv';
// Load .env.local file
dotenv.config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	// driver: 'pglite',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	verbose: true,
	strict: true,
});
