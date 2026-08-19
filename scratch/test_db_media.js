import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

import Media from '../server/models/Media.js';
import Settings from '../server/models/Settings.js';

async function testDB() {
  console.log('--- Testing Firestore DB Media & Settings ---');
  try {
    const mediaList = await Media.find();
    console.log('Media collection count:', Array.isArray(mediaList) ? mediaList.length : 'not an array');
    if (mediaList && mediaList.length > 0) {
      console.log('Sample media item:', mediaList[0]);
    }

    const settingsList = await Settings.find();
    console.log('Settings collection count:', Array.isArray(settingsList) ? settingsList.length : 'not an array');
    const siteSettings = await Settings.findOne({ key: 'site_settings' });
    if (siteSettings && siteSettings.value) {
      console.log('site_settings keys:', Object.keys(siteSettings.value));
      console.log('site_settings.media_gallery_items count:', Array.isArray(siteSettings.value.media_gallery_items) ? siteSettings.value.media_gallery_items.length : 'none');
    }
  } catch (err) {
    console.error('DB test error:', err);
  }
}

testDB();
