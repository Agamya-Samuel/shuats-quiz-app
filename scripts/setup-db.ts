/**
 * This script does a complete setup of the database:
 * 1. Connects to the database
 * 2. Runs migrations
 * 3. Seeds initial data (admin user and dummy user)
 *
 * Use this for development or testing purposes
 */

import * as dotenv from 'dotenv';
// Load .env.local file
dotenv.config({ path: '.env.local' });
console.log('Loading environment variables from .env.local');

// Load environment variables from .env.local
import argon2 from 'argon2';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { connectToDB } from '../db';
import { addresses, admins, users } from '../db/schema';
import * as dbSchema from '../db/schema';


async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Connect to the database (this will also run migrations)
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;
    console.log('Database connected and migrations applied');

    // 1. Create default admin if doesn't exist
    const adminExists = await db.query.admins.findFirst({
      where: eq(admins.username, process.env.ADMIN_USERNAME || 'admin'),
    });

    if (!adminExists) {
      // Create default admin user
      const hashedPassword = await argon2.hash(
        process.env.ADMIN_PASSWORD || 'admin',
      );
      // Insert the admin and return the inserted row
      const [admin] = await db
        .insert(admins)
        .values({
          username: process.env.ADMIN_USERNAME || 'admin',
          password: hashedPassword,
        })
        .returning({
          id: admins.id,
          username: admins.username,
        });
      console.log(
        `Default admin created - ID: ${admin.id} Username: ${admin.username}`,
      );
    } else {
      console.log('Admin user already exists');
    }

    // 2. Create dummy user if doesn't exist
    const dummyUserExists = await db.query.users.findFirst({
      where: eq(users.email, 'dummy.user@example.com'),
    });

    if (!dummyUserExists) {
      // First create an address for the dummy user
      const [address] = await db
        .insert(addresses)
        .values({
          country: 'India',
          address1: '123 Test Street',
          area: 'Test Area',
          city: 'Test City',
          pincode: '123456',
          state: 'Test State',
        })
        .returning();

      // Hash password for dummy user
      const hashedPassword = await argon2.hash('dummypass123');

      // Create dummy user
      const [dummyUser] = await db
        .insert(users)
        .values({
          name: 'Dummy User',
          email: 'dummy.user@example.com',
          password: hashedPassword,
          addressId: address.id,
          mobile: '9876543210',
          school: 'Test School',
          rollno: 'TEST123',
          branch: 'Test Branch',
        })
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
        });

      console.log(
        `Dummy user created - ID: ${dummyUser.id} Name: ${dummyUser.name}`,
      );
    } else {
      console.log('Dummy user already exists');
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
