import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

console.log('Testing api/index.js import...');
try {
  const appModule = await import('../api/index.js');
  console.log('api/index.js imported successfully!', Object.keys(appModule));
} catch (err) {
  console.error('CRITICAL SERVER IMPORT ERROR:', err);
}
