// db.ts
import { Pool } from 'pg';

let cachedPool: Pool;

// Function to get a cached PostgreSQL connection pool
// This function creates a new pool if one doesn't already exist, or returns the existing one.

export function getPool() {
  if (!cachedPool) {
    cachedPool = new Pool({
      user: process.env.PSQL_USER,
      host: process.env.PSQL_HOST,
      database: process.env.PSQL_DB,
      password: process.env.PSQL_PASSWORD,
      port: process.env.PSQL_PORT ? parseInt(process.env.PSQL_PORT, 10) : 5432,
      ssl: process.env.PSQL_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
  }
  return cachedPool;
}
