/**
 * This script does a complete setup of the database:
 * 1. Connects to the database
 * 2. Runs migrations
 * 3. Seeds initial data (admin user)
 *
 * Use this for development or testing purposes
 */

import { connectToDB, db } from '@/db';
import { admins } from '@/db/schema';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';

async function setupDatabase() {
	try {
		console.log('Starting database setup...');

		// Connect to the database (this will also run migrations)
		await connectToDB();
		console.log('Database connected and migrations applied');

		// Check if admin user exists
		const adminExists = await db.query.admins.findFirst({
			where: eq(admins.email, process.env.ADMIN_EMAIL || 'admin'),
		});

		if (!adminExists) {
			// Create default admin user
			const hashedPassword = await argon2.hash(
				process.env.ADMIN_PASSWORD || 'admin'
			);
			await db.insert(admins).values({
				email: 'admin',
				password: hashedPassword,
			});
			console.log('Default admin user created');
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
