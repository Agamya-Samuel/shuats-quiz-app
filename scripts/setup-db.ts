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
import { Pool } from 'pg';

import { connectToDB } from '../db';
import { addresses, admins, users, questions, correctAnswers } from '../db/schema';
import * as dbSchema from '../db/schema';


async function ensureDatabaseExists() {
  const dbName = 'quizdb';
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Connect to the default 'postgres' database to check for 'quizdb'
  const pool = new Pool({
    connectionString: connectionString.replace(/\/[^/]+$/, '/postgres'),
  });

  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );
    if (res.rowCount === 0) {
      console.log(`Database '${dbName}' does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created successfully.`);
    } else {
      console.log(`Database '${dbName}' already exists.`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Ensure the database exists before connecting
    await ensureDatabaseExists();

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

    // 3. Seed sample questions
    const sampleQuestions = [
      {
        question: 'What is the capital of France?',
        options: [
          { id: '1', value: 'Berlin' },
          { id: '2', value: 'Madrid' },
          { id: '3', value: 'Paris' },
          { id: '4', value: 'Rome' },
        ],
        subject: 'General Knowledge',
        correctOption: '3',
      },
      {
        question: 'What is 2 + 2?',
        options: [
          { id: '1', value: '3' },
          { id: '2', value: '4' },
          { id: '3', value: '5' },
          { id: '4', value: '6' },
        ],
        subject: 'Arithmatic',
        correctOption: '2',
      },
      {
        question: 'What is the largest planet in our solar system?',
        options: [
          { id: '1', value: 'Earth' },
          { id: '2', value: 'Jupiter' },
          { id: '3', value: 'Mars' },
          { id: '4', value: 'Saturn' },
        ],
        subject: 'General Knowledge',
        correctOption: '2',
      },
      {
        question: 'What is the chemical symbol for water?',
        options: [
          { id: '1', value: 'O2' },
          { id: '2', value: 'H2O' },
          { id: '3', value: 'CO2' },
          { id: '4', value: 'NaCl' },
        ],
        subject: 'General Knowledge',
        correctOption: '2',
      },
      {
        question: 'Who wrote "Romeo and Juliet"?',
        options: [
          { id: '1', value: 'William Shakespeare' },
          { id: '2', value: 'Charles Dickens' },
          { id: '3', value: 'Mark Twain' },
          { id: '4', value: 'Jane Austen' },
        ],
        subject: 'General Knowledge',
        correctOption: '1',
      },
    ];

    console.log('Seeding sample questions...');
    for (const q of sampleQuestions) {
      const existingQuestion = await db.query.questions.findFirst({
        where: eq(questions.question, q.question),
      });

      if (!existingQuestion) {
        const [newQuestion] = await db
          .insert(questions)
          .values({
            question: q.question,
            options: q.options,
            subject: q.subject,
          })
          .returning({ id: questions.id });

        await db.insert(correctAnswers).values({
          questionId: newQuestion.id,
          correctOption: q.correctOption,
        });
        console.log(`Inserted question: ${q.question}`);
      }
    }
    console.log('Sample questions seeded successfully');

    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
