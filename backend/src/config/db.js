import pg from 'pg';

const { Pool } = pg;
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required. Add your Neon connection string to backend/.env.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return pool;
}

export async function query(text, params) {
  return getPool().query(text, params);
}

export async function verifyDatabaseConnection() {
  await getPool().query('SELECT 1');
}

export { getPool };
