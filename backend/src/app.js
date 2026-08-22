import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
export default app;
