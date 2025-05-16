import { initializeDB } from '@/db';

// Access or initialize the global initialization tracker
declare global {
  // eslint-disable-next-line no-var
  var __db_initialization_in_progress: Promise<boolean> | undefined;
}

/**
 * Initialize the database connection.
 * This ensures initialization happens only once across all serverless function invocations.
 */
export async function initializeDatabase() {
  if (process.env.VERCEL) {
    console.log('Skipping DB initialization during Vercel build');
    return null; // Or handle appropriately
  }
  // If initialization is already in progress, return that promise
  if (global.__db_initialization_in_progress) {
    return global.__db_initialization_in_progress;
  }

  // Start initialization and store the promise globally
  global.__db_initialization_in_progress = (async () => {
    try {
      // Perform database initialization
      await initializeDB();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Database fully initialized (from lib/db-init.ts)');
      }
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Clear the initialization promise so we can try again on next request
      global.__db_initialization_in_progress = undefined;
      return false;
    }
  })();

  return global.__db_initialization_in_progress;
}

// This ensures the database is initialized when this module is imported
export const dbInitPromise = initializeDatabase(); 