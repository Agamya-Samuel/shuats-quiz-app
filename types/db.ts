import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '@/db/schema';

// Define the DrizzleClient type with schema queries
export type DrizzleClient = NodePgDatabase<typeof schema>;
