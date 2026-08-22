import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Auto-sync uploaded image from conversation artifacts to client public and src/assets
try {
  const sourcePath = 'C:/Users/aksha/.gemini/antigravity-ide/brain/0deea551-f1f4-49b8-819e-76cdf5f937f0/.user_uploaded/media_1787072367913.jpg';
  const targetPublicPath = path.resolve(__dirname, 'public/images/user_uploaded_bedroom.jpg');
  const targetAssetJsPath = path.resolve(__dirname, 'src/assets/userUploadedBedroom.js');

  if (fs.existsSync(sourcePath)) {
    const fileBuffer = fs.readFileSync(sourcePath);
    fs.writeFileSync(targetPublicPath, fileBuffer);
    const jsContent = `export const USER_UPLOADED_BEDROOM_IMAGE = "/images/user_uploaded_bedroom.jpg";\nexport default USER_UPLOADED_BEDROOM_IMAGE;\n`;
    fs.writeFileSync(targetAssetJsPath, jsContent);
  }
} catch (e) {
  console.warn('Image sync notice:', e);
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: path.resolve(__dirname, 'postcss.config.js'),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.warn('Vite backend proxy connection notice:', err.message);
            if (res && !res.headersSent) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, count: 0, data: [], offline: true }));
            }
          });
        }
      }
    }
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    exclude: ['@use-gesture/react'],
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react-helmet-async')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion') || id.includes('lenis')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('axios') || id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
