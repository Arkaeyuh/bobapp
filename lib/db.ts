import { Pool } from 'pg';

declare global {
  // Extend the NodeJS global interface to include pgPool
  // This ensures TypeScript knows the type of global.pgPool.
  var pgPool: Pool | undefined;
}

//Since we want to deploy to vercel, we need to use the global object to store the pool connection
//This is because Vercel will restart the server on every request, so we need to store the pool connection in a global object
//This way, the pool connection will be shared between requests
//This is not a good practice, but it is necessary for Vercel

let pool: Pool;

if (!global.pgPool) {
  global.pgPool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DB,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT ? parseInt(process.env.PSQL_PORT, 10) : 5432,
    ssl: process.env.PSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined, // Explicitly handle SSL
  });
}

pool = global.pgPool;

export default pool;
