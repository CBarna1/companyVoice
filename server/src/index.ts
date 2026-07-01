import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import sequelize from './config/database';
import { initializeModels } from './models';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import votesRoutes from './routes/votes';
import commentsRoutes from './routes/comments';
import leaderboardRoutes from './routes/leaderboard';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_BASE_URL || 'https://companyvoice.vercel.app'
  : 'http://localhost:5173';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Initialize models
initializeModels(sequelize);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/posts', votesRoutes);
app.use('/api/posts', commentsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// Database sync and server start (only for local development)
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: false });
    console.log('Models synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if running locally (not in Vercel environment)
if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
