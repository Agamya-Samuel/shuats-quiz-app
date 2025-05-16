// Load environment variables from .env.local
import 'dotenv/config';
import * as dotenv from 'dotenv';
// Load .env.local file
dotenv.config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

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

export default defineConfig({
	schema: './db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	// driver: 'pglite',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
		ssl: sslConfig
	},
	verbose: true,
	strict: true,
});
