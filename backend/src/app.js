import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import shareRoutes from './routes/shareRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const allowedOrigins = [...new Set([
  'http://localhost:5173',
  'https://globe-trotter-d6ys.vercel.app',
  ...(process.env.FRONTEND_URL || '').split(','),
].map((origin) => origin.trim()).filter(Boolean))];
app.use(cors({ origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(null, false);
} }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/trips', expenseRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api', shareRoutes);
app.use('/api', activityRoutes);
app.use(errorHandler);
export default app;
