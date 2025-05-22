/**
 * This script does a complete setup of the database:
 * 1. Connects to the database
 * 2. Runs migrations
 * 3. Seeds initial data (admin user)
 *
 * Use this for development or testing purposes
 */

// Load environment variables from .env.local
import 'dotenv/config';
import * as dotenv from 'dotenv';
// Load .env.local file
dotenv.config({ path: '.env.local' });

import { connectToDB } from '../db';
import { admins } from '../db/schema';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from '../db/schema';

async function setupDatabase() {
	try {
		console.log('Starting database setup...');

		// Connect to the database (this will also run migrations)
		// Connect to db
		const db = (await connectToDB()) as unknown as NodePgDatabase<
			typeof dbSchema
		>;
		console.log('Database connected and migrations applied');

		// Check if admin user exists
		const adminExists = await db.query.admins.findFirst({
			where: eq(admins.username, process.env.ADMIN_USERNAME || 'admin'),
		});

		if (!adminExists) {
			// Create default admin user
			const hashedPassword = await argon2.hash(
				process.env.ADMIN_PASSWORD || 'admin'
			);
			// Insert the admin and return the inserted row (id, username)
			const [admin] = await db.insert(admins)
				.values({
					username: process.env.ADMIN_USERNAME || 'admin',
					password: hashedPassword,
				})
				.returning({
					id: admins.id,
					username: admins.username,
				});
			console.log(`Default admin ID: ${admin.id} Username: ${admin.username}`);
		} else {
			console.log('Admin user already exists');
		}

		console.log('Database setup completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Database setup failed:', error);
		process.exit(1);
	}
}

// Run the setup
setupDatabase();
