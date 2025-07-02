import {StyleSheet, Dimensions} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Helper functions for responsive design
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

// Responsive font size
const responsiveFontSize = size => {
  const scale = screenWidth / 420; // Base width (iPhone X)
  const newSize = size * scale;
  return Math.max(10, Math.min(newSize, 20)); // Min 10, Max 20
};

// Get card width based on screen size
const getCardWidth = () => {
  if (screenWidth < 350) return '31%'; // 2 columns for small phones
  if (screenWidth < 500) return '31%'; // 3 columns for medium phones
  if (screenWidth < 768) return '31%'; // 3 columns for large phones
  return '24%'; // 4 columns for tablets
};

// Get image height based on screen size
const getImageHeight = () => {
  if (screenWidth < 350) return hp(12); // Small phones
  if (screenWidth < 400) return hp(13); // Medium phones
  if (screenWidth < 500) return hp(14); // Large phones
  return hp(15); // Tablets
};

// Get more button size
const getMoreButtonSize = () => {
  if (screenWidth < 350) return wp(6); // Small phones
  return wp(6.5); // Other devices
};

const styles = StyleSheet.create({
  card: {
    width: getCardWidth(),
    borderRadius: wp(2.5),
    padding: wp(1),
    marginHorizontal: wp(1.1),
    marginBottom: hp(0.6),
  },

  variantsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: hp(1),
    overflow: 'hidden',
    alignItems: 'center',
  },

  variantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(0.8),
    backgroundColor: '#E5F1FF',
    color: '#3C5D85',
    borderRadius: wp(1),
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2),
    // maxWidth: wp(20), // Prevent variants from being too wide
  },

  selectedVariantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(0.8),
    backgroundColor: '#3C5D85',
    borderRadius: wp(1),
    paddingVertical: hp(0.3),
    paddingHorizontal: wp(2),
    maxWidth: wp(20),
  },

  variantText: {
    fontSize: responsiveFontSize(12),
    color: '#333',
    // flexShrink: 1, // Allow text to shrink if needed
  },

  selectedVariantText: {
    fontSize: responsiveFontSize(12),
    color: '#FFF',
    // flexShrink: 1,
  },

  moreButton: {
    backgroundColor: '#3C5D85',
    borderRadius: wp(1.5),
    width: getMoreButtonSize(),
    justifyContent: 'center',
    alignItems: 'center',

    // marginLeft: wp(1),
  },

  moreButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: getImageHeight(),
    borderRadius: wp(2),
  },

  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2),
  },

  addButton: {
    position: 'absolute',
    right: wp(0.8),
    bottom: hp(-1.2),
    zIndex: 9000,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3C5D85',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(1.5),
    elevation: 3,
    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    // minHeight: hp(3), // Minimum touch target
  },

  addButtonText: {
    color: '#3C5D85',
    fontWeight: '600',
    fontSize: responsiveFontSize(12),
  },

  infoContainer: {
    flex: 1,
    marginTop: hp(1),
  },

  size: {
    fontSize: responsiveFontSize(10),
    backgroundColor: '#E5F1FF',
    borderRadius: wp(0.8),
    marginTop: hp(1.8),
    textAlign: 'left',
    fontWeight: '500',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    color: '#3C5D85',
  },

  name: {
    fontSize: responsiveFontSize(13),
    fontWeight: '600',
    marginVertical: hp(0.5),
    lineHeight: responsiveFontSize(16),
    flexWrap: 'wrap',
  },

  brandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.3),
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },

  brandText: {
    fontSize: responsiveFontSize(10),
    color: '#333',
    flex: 1,
    marginRight: wp(1),
  },

  UnitText: {
    fontSize: responsiveFontSize(10),
    color: '#333',
    flexShrink: 0, // Prevent shrinking
  },
});

export default styles;
