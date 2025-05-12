import { drizzle } from 'drizzle-orm/node-postgres';
import { getConnectionPool } from './index';
import * as schema from './schema';
import { pgTableCreator } from 'drizzle-orm/pg-core';

// Setup the query builder with the schema
export const db = drizzle(getConnectionPool(), { schema });

// Create a prepared query builder
export const createTable = pgTableCreator((name) => name);

// Export the query builder for use in other files
export { schema };
