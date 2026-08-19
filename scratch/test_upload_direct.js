import fetch from 'node-fetch';

async function testUpload() {
  console.log('Testing direct backend upload to http://127.0.0.1:5000/api/upload-media...');
  
  // Create a simple base64 image data URL (1x1 transparent GIF)
  const dummyBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  try {
    const res = await fetch('http://127.0.0.1:5000/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: 'test_direct.gif',
        base64: dummyBase64
      })
    });

    console.log('Response status:', res.status);
    const text = await res.text();
    console.log('Response body:', text);
  } catch (err) {
    console.error('Direct connection failed:', err);
  }
}

testUpload();
