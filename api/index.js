import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'nzK7g7iDlzlDC5qF2Y5tgcZZc/nQqBr8KoVZW9rXkI0E/rWH7OBBPTI7A1QEKUC5RicIx8/42dw+GUWedUfhgg==';
}

import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
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

// Request parsers with 50mb payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
const uploadsDir = path.resolve(__dirname, '../client/public/uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
}
app.use('/uploads', express.static(uploadsDir));

// Upload media endpoint (placed before rate limiter to ensure smooth uploads)
app.post('/api/upload-media', (req, res) => {
  try {
    const { fileName, base64 } = req.body || {};
    if (!fileName || !base64) {
      return res.status(400).json({ success: false, message: 'File name and base64 string required' });
    }
    const ext = (fileName.split('.').pop() || 'jpg').toLowerCase();
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeName = `${baseName}_${Date.now()}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    res.json({ success: true, url: `/uploads/${safeName}`, fileName: safeName });
  } catch (err) {
    console.error('Server upload-media error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Compression
app.use(compression());

// Rate limiter for general API routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
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

// Serve user-uploaded bedroom image
app.get('/api/user-uploaded-bedroom.jpg', (req, res) => {
  const imgPath = path.resolve('C:/Users/aksha/.gemini/antigravity-ide/brain/0deea551-f1f4-49b8-819e-76cdf5f937f0/.user_uploaded/media_1787072367913.jpg');
  res.sendFile(imgPath);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Healthy', timestamp: new Date() });
});

// Global error handler
app.use(errorHandler);

// Export for Vercel serverless
export default app;
