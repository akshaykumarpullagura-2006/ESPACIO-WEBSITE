import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';
import { uploadToCloudinary } from '../server/utils/cloudinaryHelper.js';

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
import mediaRoutes from '../server/routes/mediaRoutes.js';
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
  origin: true,
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

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Shared upload handler for Gallery media
const uploadHandler = (req, res, next) => {
  console.log('[STAGE 5: UPLOAD_ENDPOINT_REACHED]', req.url);
  console.log('[STAGE 6: MULTER_STARTED]');
  upload.single('file')(req, res, async (multerErr) => {
    if (multerErr) {
      console.error('[BACKEND MULTER ERROR STAGE]', multerErr);
      return res.status(400).json({ success: false, error: multerErr.message || 'File upload parsing error' });
    }

    try {
      let fileName = req.body?.fileName || req.file?.originalname || 'uploaded_image.jpg';
      let base64 = req.body?.base64;

      if (!base64 && req.file && req.file.buffer) {
        const mime = req.file.mimetype || 'image/jpeg';
        base64 = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      }

      console.log('[STAGE 7: FILE_RECEIVED]');
      console.log('[STAGE 8: FILE_NAME]', fileName);
      console.log('[STAGE 9: FILE_SIZE]', req.file ? req.file.size : 'base64 mode');
      console.log('[STAGE 10: FILE_MIMETYPE]', req.file ? req.file.mimetype : 'image');

      if (!base64) {
        console.error('[BACKEND ERROR STAGE: NO FILE DATA]');
        return res.status(400).json({ success: false, error: 'No file or image data received by server' });
      }

      const cloudRes = await uploadToCloudinary(base64, fileName);

      console.log('[STAGE 16: API_RESPONSE_SENT]', cloudRes.secure_url);
      return res.status(200).json({
        success: true,
        url: cloudRes.secure_url,
        imageUrl: cloudRes.secure_url,
        fileName: fileName,
        cloudinaryPublicId: cloudRes.public_id,
        cloudinaryAssetId: cloudRes.asset_id,
        storageProvider: 'cloudinary',
        resourceType: cloudRes.resource_type,
        format: cloudRes.format,
        width: cloudRes.width,
        height: cloudRes.height,
        fileSize: (cloudRes.bytes / 1024).toFixed(1) + ' KB',
        createdAt: cloudRes.created_at
      });
    } catch (uploadErr) {
      console.error('[BACKEND ERROR STAGE: CLOUDINARY UPLOAD FAILED]', uploadErr);
      return res.status(500).json({ success: false, error: uploadErr.message || 'Cloudinary upload error' });
    }
  });
};

app.post('/api/upload-media', uploadHandler);
app.post('/upload-media', uploadHandler);

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
app.use('/api/media', mediaRoutes);
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
