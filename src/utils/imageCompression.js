import imageCompression from 'browser-image-compression';

/**
 * Compress image before upload
 * Reduces file size by 80-90% while maintaining visual quality
 *
 * @param {File} imageFile - The original image file
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(imageFile, options = {}) {
  const defaultOptions = {
    maxSizeMB: 0.5, // Max file size: 500KB (from 5MB)
    maxWidthOrHeight: 1920, // Max dimension: 1920px
    useWebWorker: true, // Use web worker for better performance
    fileType: imageFile.type, // Preserve original format
    initialQuality: 0.8, // 80% quality (good balance)
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    console.log('[Compression] Original file:', {
      name: imageFile.name,
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: imageFile.type,
    });

    const compressedFile = await imageCompression(imageFile, compressionOptions);

    // Ensure the compressed file has the original filename (important for backend validation)
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
    // Return original file if compression fails
    return imageFile;
  }
}

/**
 * Compress profile picture (smaller dimensions)
 */
export async function compressProfilePicture(imageFile) {
  return compressImage(imageFile, {
    maxSizeMB: 0.2, // 200KB max
    maxWidthOrHeight: 512, // Profile pics don't need to be huge
    initialQuality: 0.85, // Higher quality for profile
  });
}
