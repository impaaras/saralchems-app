import {Platform} from 'react-native';

/**
 * Optimizes image source URL based on platform and dimensions
 * @param {string} url Original image URL
 * @param {number} width Desired width (optional)
 * @param {number} height Desired height (optional)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, width, height) => {
  if (!url) return '';

  // Handle remote URLs (add dimensions for CDN optimization if available)
  if (url.startsWith('http')) {
    // Example for common CDNs (customize based on your image provider)
    if (url.includes('pexels.com') && width && height) {
      // Pexels supports auto resize
      return `${url}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
    }
  }

  return url;
};

/**
 * Checks if an image exists and is accessible
 * @param {string} url Image URL to check
 * @returns {Promise<boolean>} Promise resolving to boolean indicating if image exists
 */
export const checkImageExists = async url => {
  if (!url || !url.startsWith('http')) return false;

  try {
    const response = await fetch(url, {method: 'HEAD'});
    return response.ok;
  } catch (error) {
    console.warn('Error checking image existence:', error);
    return false;
  }
};

/**
 * Provides a fallback image URL if the original fails
 * @param {string} originalUrl Original image URL
 * @param {string} fallbackUrl Fallback image URL
 * @returns {Promise<string>} Promise resolving to a valid image URL
 */
export const getImageWithFallback = async (
  originalUrl,
  fallbackUrl = 'https://via.placeholder.com/400',
) => {
  if (await checkImageExists(originalUrl)) {
    return originalUrl;
  }
  return fallbackUrl;
};

/**
 * Constants for common image dimensions to maintain consistency
 */
export const ImageSizes = {
  thumbnail: {width: 100, height: 100},
  small: {width: 200, height: 200},
  medium: {width: 400, height: 400},
  large: {width: 800, height: 600},
  productDetail: {width: 600, height: 600},
};

/**
 * Helper to get appropriate image loading priority based on visibility
 * @param {boolean} isVisible Whether the image is currently visible in viewport
 * @returns {any} Loading priority string for web or null for native
 */
export const getImageLoadingPriority = isVisible => {
  if (Platform.OS !== 'web') return null;

  return isVisible ? 'high' : 'lazy';
};
