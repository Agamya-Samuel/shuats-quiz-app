import * as schema from '@/db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

// Define the DrizzleClient type with schema queries
export type DrizzleClient = NodePgDatabase<typeof schema>; 