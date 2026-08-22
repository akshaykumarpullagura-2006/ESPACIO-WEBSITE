/**
 * ESPACIO Image Optimization Utility
 * Automatically injects Cloudinary (f_auto, q_auto, w_X) and Unsplash (fm=webp, q=X, w_X)
 * transformation parameters to ensure high performance and minimal network payload (<600KB total).
 */

export const getOptimizedImageUrl = (url, width = 1200, quality = 75) => {
  if (!url || typeof url !== 'string') return url;

  // Base64 strings or SVG inline assets
  if (url.startsWith('data:') || url.endsWith('.svg')) {
    return url;
  }

  // Cloudinary image URL optimization
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    if (!url.includes('f_auto') && !url.includes('q_auto')) {
      return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
    }
  }

  // Unsplash image URL optimization
  if (url.includes('images.unsplash.com')) {
    // Strip out previous w=, q=, fm= parameters to avoid conflicts
    let cleanUrl = url.replace(/([?&])w=\d+/g, '').replace(/([?&])q=\d+/g, '').replace(/([?&])fm=[a-zA-Z0-9]+/g, '');
    const separator = cleanUrl.includes('?') ? '&' : '?';
    return `${cleanUrl}${separator}fm=webp&q=${quality}&w=${width}&auto=format&fit=crop`;
  }

  return url;
};

export default getOptimizedImageUrl;
