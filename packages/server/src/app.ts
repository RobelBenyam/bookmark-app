import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import linkRoutes from './routes/links';
import tagRoutes from './routes/tags';
import searchRoutes from './routes/search';
import { prisma } from './lib/prisma';

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
}); 