import fs from 'fs';
import path from 'path';

// Storage provider configurations
const provider = process.env.STORAGE_PROVIDER || 'local';

/**
 * Abstracted upload file function
 * @param {Object} file Multer file object
 * @returns {Promise<String>} Public URL or relative file path
 */
export const uploadFile = async (file) => {
  if (provider === 'cloudinary') {
    // Lazy load Cloudinary to prevent dependency crash if not configured
    const { v2: cloudinary } = await import('cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file.path,
        { folder: 'espacio' },
        (error, result) => {
          // Delete temp file after uploading to cloud
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
    });
  }

  // Fallback / default: local storage
  // Return relative path. For production, Nginx or Express static middleware serves it.
  return `/uploads/${path.basename(file.path)}`;
};

/**
 * Abstracted delete file function
 * @param {String} fileUrl Path or URL of the file to delete
 */
export const deleteFile = async (fileUrl) => {
  if (provider === 'cloudinary') {
    const { v2: cloudinary } = await import('cloudinary');
    // Extract public ID from URL
    const parts = fileUrl.split('/');
    const folderAndName = parts.slice(parts.indexOf('espacio')).join('/');
    const publicId = folderAndName.split('.')[0]; // remove extension

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  // Local storage deletion
  if (fileUrl.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
};
