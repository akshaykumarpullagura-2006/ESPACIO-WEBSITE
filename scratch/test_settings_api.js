import axios from 'axios';

async function testSettings() {
  try {
    console.log('1. Fetching current settings from GET http://localhost:5000/api/settings ...');
    const getRes = await axios.get('http://localhost:5000/api/settings');
    console.log('GET response success:', getRes.data.success);
    console.log('Current hero_bg_images:', getRes.data.data?.hero_bg_images);

    const testUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80';
    const updatedImages = [
      testUrl,
      '/images/user_uploaded_bedroom.jpg'
    ];

    const currentData = getRes.data.data || {};
    const payload = {
      ...currentData,
      hero_bg_images: updatedImages
    };

    console.log('2. Sending PUT http://localhost:5000/api/settings with payload:');
    console.log('hero_bg_images count:', payload.hero_bg_images.length);
    console.log('First image URL:', payload.hero_bg_images[0]);

    const putRes = await axios.put('http://localhost:5000/api/settings', payload);
    console.log('PUT response:', putRes.data);

    console.log('3. Re-fetching GET http://localhost:5000/api/settings to verify persistence ...');
    const verifyRes = await axios.get('http://localhost:5000/api/settings');
    console.log('Re-fetched hero_bg_images:', verifyRes.data.data?.hero_bg_images);

  } catch (err) {
    console.error('Error during test:', err.message, err.response?.data);
  }
}

testSettings();
