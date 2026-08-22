import 'dotenv/config';
import app from './app.js';
import { verifyDatabaseConnection } from './config/db.js';

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await verifyDatabaseConnection();
    app.listen(port, '0.0.0.0', () => console.log(`API running on port ${port}`));
  } catch (error) {
    console.error('Unable to connect to Neon database:', error.message);
    process.exit(1);
  }
}

startServer();
