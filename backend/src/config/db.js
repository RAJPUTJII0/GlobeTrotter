import pg from 'pg';

const { Pool, types } = pg;
types.setTypeParser(1082, (value) => value);
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
  const database = getPool();
  await database.query('ALTER TABLE trips ADD COLUMN IF NOT EXISTS cover_image TEXT');
  await database.query('ALTER TABLE activities ADD COLUMN IF NOT EXISTS description TEXT');
  await database.query('ALTER TABLE stop_activities ADD COLUMN IF NOT EXISTS activity_order INTEGER');
  await database.query("ALTER TABLE trips ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'INR'");
  await database.query("ALTER TABLE trips ADD COLUMN IF NOT EXISTS travel_styles TEXT[] NOT NULL DEFAULT '{}'");
  await database.query('SELECT 1');
}

export { getPool };
