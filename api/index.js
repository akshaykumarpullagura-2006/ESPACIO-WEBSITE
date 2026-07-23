// api/index.js — Vercel Serverless entry for Express
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../server/config/db.js';
import { errorHandler } from '../server/middleware/errorMiddleware.js';

// Routes
import authRoutes from '../server/routes/authRoutes.js';
import leadRoutes from '../server/routes/leadRoutes.js';
import projectRoutes from '../server/routes/projectRoutes.js';
import productRoutes from '../server/routes/productRoutes.js';
import categoryRoutes from '../server/routes/categoryRoutes.js';
import testimonialRoutes from '../server/routes/testimonialRoutes.js';
import faqRoutes from '../server/routes/faqRoutes.js';
import settingsRoutes from '../server/routes/settingsRoutes.js';
import dashboardRoutes from '../server/routes/dashboardRoutes.js';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../server/.env') });

// Connect to MongoDB (Vercel keeps connections warm between invocations)
connectDB();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS — allow the Vercel deployment domain + localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain automatically
    if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS not allowed for: ' + origin));
  },
  credentials: true,
}));

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, try again in 15 minutes.' },
});
app.use('/api/', limiter);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Healthy', timestamp: new Date() });
});

// Global error handler
app.use(errorHandler);

// Export for Vercel serverless
export default app;
