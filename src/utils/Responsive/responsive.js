// responsive.js
import {Dimensions} from 'react-native';

// Get screen dimensions once
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Guideline sizes based on a standard ~5" screen mobile device
const guidelineBaseWidth = 380;
const guidelineBaseHeight = 680;

// Scale based on screen size
const scale = size => (screenWidth / guidelineBaseWidth) * size;
const verticalScale = size => (screenHeight / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Width & height percentage
const wp = percentage => (percentage * screenWidth) / 100;
const hp = percentage => (percentage * screenHeight) / 100;

// Screen checks
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 380;

// Helper to format a date string
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Export utilities
export {
  scale,
  verticalScale,
  moderateScale,
  wp,
  hp,
  formatDate,
  isTablet,
  isSmallScreen,
};
