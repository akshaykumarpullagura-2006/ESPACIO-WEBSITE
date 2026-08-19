import crypto from 'crypto';

/**
 * Upload image to Cloudinary using signed upload API (Server-side only)
 */
export const uploadToCloudinary = async (base64Data, fileName) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'r3jwfy0y';
  const apiKey = process.env.CLOUDINARY_API_KEY || '257828485693533';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'npTHsY3MrJhYzYyKfZ0mUpp1Fvc';
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'espacio_gallery';

  // Construct signature string according to Cloudinary spec: sorted_params + api_secret
  const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  // Convert Base64 string to clean binary Buffer & Blob for multipart stream
  const base64Clean = (base64Data || '').replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Clean, 'base64');
  const blob = new Blob([buffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('file', blob, fileName || 'upload.jpg');
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);

  console.log('[STAGE 11: CLOUDINARY_UPLOAD_STARTED]', fileName);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    const errorMsg = data.error?.message || res.headers.get('X-Cld-Error') || 'Cloudinary HTTP error';
    console.error('[CLOUDINARY ERROR STAGE]', errorMsg, data);
    throw new Error(errorMsg);
  }

  console.log('[STAGE 12: CLOUDINARY_UPLOAD_SUCCESS]');
  console.log('[STAGE 13: CLOUDINARY_SECURE_URL]', data.secure_url);

  return {
    url: data.secure_url || data.url,
    secure_url: data.secure_url,
    public_id: data.public_id,
    asset_id: data.asset_id,
    format: data.format,
    resource_type: data.resource_type,
    bytes: data.bytes,
    width: data.width,
    height: data.height,
    created_at: data.created_at
  };
};

/**
 * Delete asset from Cloudinary using signed destroy API (Server-side only)
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'r3jwfy0y';
  const apiKey = process.env.CLOUDINARY_API_KEY || '257828485693533';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'npTHsY3MrJhYzYyKfZ0mUpp1Fvc';
  const timestamp = Math.floor(Date.now() / 1000);

  const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

  const formData = new URLSearchParams();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);

  try {
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });
  } catch (err) {
    console.warn('Cloudinary destroy asset error:', err);
  }
};
