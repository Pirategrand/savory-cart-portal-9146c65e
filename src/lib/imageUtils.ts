
/**
 * Generates optimized image URLs for different screen sizes
 * @param originalUrl - The original image URL
 * @param options - Options for image optimization
 * @returns An optimized image URL
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options: {
    width?: number,
    quality?: number,
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): string {
  // If the URL is missing or a data URL, return as is
  if (!originalUrl || originalUrl.startsWith('data:') || originalUrl.startsWith('blob:')) {
    return originalUrl;
  }

  // For local development placeholder images
  if (originalUrl.includes('/placeholder.svg')) {
    return originalUrl;
  }

  // Default options
  const { width = 800, quality = 80, format = 'webp' } = options;

  // For images hosted on imgix, cloudinary, etc. we can use their image optimization APIs
  if (originalUrl.includes('randomuser.me')) {
    // RandomUser.me doesn't support optimization parameters, so return as is
    return originalUrl;
  }

  // For other external images, we can't optimize them directly
  // In a real app, you might want to use a proxy service or CDN for external images
  return originalUrl;
}

/**
 * Returns the appropriate image size based on the screen size
 * @param screenWidth - The screen width
 * @returns The optimal image width
 */
export function getResponsiveImageSize(screenWidth: number): number {
  if (screenWidth < 640) {
    return 320; // Mobile
  } else if (screenWidth < 1024) {
    return 640; // Tablet
  } else if (screenWidth < 1920) {
    return 800; // Desktop
  } else {
    return 1200; // Large Desktop/4K
  }
}

/**
 * A React hook for responsive images
 * @param originalUrl - The original image URL
 * @param options - Options for image optimization
 * @returns An optimized image URL
 */
export function useResponsiveImage(
  originalUrl: string,
  options: {
    quality?: number,
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): string {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const responsiveWidth = getResponsiveImageSize(width);
  
  return getOptimizedImageUrl(originalUrl, {
    width: responsiveWidth,
    ...options
  });
}

/**
 * Preloads an image to improve perceived performance
 * @param src - The image URL to preload
 */
export function preloadImage(src: string): void {
  if (typeof window === 'undefined' || !src) return;
  
  const img = new Image();
  img.src = src;
}

/**
 * Preloads multiple images
 * @param srcs - Array of image URLs to preload
 */
export function preloadImages(srcs: string[]): void {
  srcs.forEach(src => preloadImage(src));
}
