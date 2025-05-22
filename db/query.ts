import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTableCreator } from 'drizzle-orm/pg-core';
import * as schema from './schema';
import { Pool } from 'pg';

// Re-export schema
export { schema };

// Initialize db lazily to avoid circular dependency
let _db: ReturnType<typeof drizzle> | null = null;

export function initDb(pool: Pool) {
  if (!_db) {
    _db = drizzle(pool, { schema });
  }
  return _db;
}

// Getter for the db instance
export const db = {
  get instance() {
    // This will be initialized properly when getConnectionPool is called
    if (!_db) {
      throw new Error('Database not initialized. Call connectToDB first.');
    }
    return _db;
  },
  // Forward any property access to the actual db instance
  get query() { return this.instance.query; },
  get insert() { return this.instance.insert; },
  get select() { return this.instance.select; },
  get update() { return this.instance.update; },
  get delete() { return this.instance.delete; },
  get transaction() { return this.instance.transaction; },
};

// Create a prepared query builder
export const createTable = pgTableCreator((name) => name);
