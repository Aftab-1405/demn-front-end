import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload
 * Reduces file size by 80-90% while maintaining visual quality
 * Optimized for speed: 1280px max dimension, 70% quality, max 10 iterations
 *
 * @param {File} imageFile - The original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(imageFile, options = {}) {
  const defaultOptions = {
    maxSizeMB: 0.5,          // Max file size: 500KB (Target)
    maxWidthOrHeight: 1280,  // Max dimension: 1280px (HD) - Faster processing than 1920px
    useWebWorker: true,      // Use web worker for better performance (non-blocking)
    fileType: imageFile.type,// Preserve original format (e.g., image/jpeg)
    initialQuality: 0.7,     // Start at 70% quality for faster convergence (less loops)
    maxIteration: 10,        // Safety: Stop after 10 tries to prevent CPU hanging on complex images
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    // Logging for debugging
    console.log('[Compression] Original file:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: imageFile.type,
    });

    // Start Compression
    const compressedFile = await imageCompression(imageFile, compressionOptions);

    // Ensure the compressed file has the original filename 
    // (Library sometimes changes it to 'blob', which might fail backend validation)
    const renamedFile = new File([compressedFile], imageFile.name, {
      type: compressedFile.type || imageFile.type,
      lastModified: Date.now(),
    });

    console.log('[Compression] Compressed file:', {
      name: renamedFile.name,
      size: `${(renamedFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: renamedFile.type,
      reduction: `${(((imageFile.size - renamedFile.size) / imageFile.size) * 100).toFixed(1)}%`,
    });

    return renamedFile;
  } catch (error) {
    console.error('[Compression] Error:', error);
    // Fallback: Return original file if compression fails so upload doesn't break
    return imageFile;
  }
}

/**
 * Compress profile picture (smaller dimensions)
 * Profile pics are small circles, so 512px is more than enough
 */
export async function compressProfilePicture(imageFile) {
  return compressImage(imageFile, {
    maxSizeMB: 0.2,          // 200KB max target
    maxWidthOrHeight: 512,   // Smaller dimension for profile pics
    initialQuality: 0.85,    // Slightly higher quality for faces
  });
}