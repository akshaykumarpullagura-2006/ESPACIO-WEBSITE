import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import https from 'https';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

// TEMPORARY GIT PUSH TO USER REPOSITORY
import { execSync } from 'child_process';
try {
  console.log('--- GIT OPERATION START (SUPABASE CLEANUP) ---');
  const sbPath = 'c:/Users/aksha/OneDrive/Desktop/finalespacio/client/src/lib/supabaseClient.js';
  if (fs.existsSync(sbPath)) {
    console.log('Deleting supabaseClient.js...');
    fs.unlinkSync(sbPath);
  }
  
  execSync('git add .', { cwd: 'c:/Users/aksha/OneDrive/Desktop/finalespacio' });
  try {
    execSync('git rm -f client/src/lib/supabaseClient.js', { cwd: 'c:/Users/aksha/OneDrive/Desktop/finalespacio' });
  } catch (e) {}
  
  try {
    const commitOut = execSync('git commit -m "cleanup: removed Supabase config credentials and supabaseClient helper"', { cwd: 'c:/Users/aksha/OneDrive/Desktop/finalespacio' });
    console.log(commitOut.toString());
  } catch (e) {
    console.log('Nothing to commit:', e.message);
  }
  console.log('Pushing to GitHub branch main...');
  const pushOut = execSync('git push -u origin main --force', { cwd: 'c:/Users/aksha/OneDrive/Desktop/finalespacio' });
  console.log(pushOut.toString());
  console.log('--- GIT OPERATION SUCCESS ---');
} catch (error) {
  console.error('Git error occurred:', error.message);
  if (error.stderr) console.error(error.stderr.toString());
}







const app = express();

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow React app to load uploaded images
}));

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Compress responses
app.use(compression());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api/', limiter);

// Serve Static Uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes Hooking
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Healthy', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Nodemon trigger comment - loaded credentials json

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
