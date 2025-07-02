// import {StyleSheet} from 'react-native';

// const styles = StyleSheet.create({
//   screen: {backgroundColor: '#F2F7FE', flex: 1},
//   scrollWrapper: {
//     marginTop: -80,
//     marginLeft: 10,
//   },
//   container: {
//     backgroundColor: '#E5F1FF',
//     flexDirection: 'row',
//     borderRadius: 15,
//     paddingHorizontal: 10,
//   },
//   itemContainer: {
//     marginTop: 20,
//     marginLeft: 10,
//     marginRight: 10,
//     alignItems: 'center',
//   },
//   selectedItem: {opacity: 1},
//   image: {width: 95, height: 95, borderRadius: 15},
//   itemTitle: {fontSize: 14, textAlign: 'center', marginTop: 5, width: 95},
//   borderBottom: {
//     width: '100%',
//     height: 4,
//     borderRadius: 10,
//     backgroundColor: '#3C5D85',
//     marginTop: 5,
//   },
//   productsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 20,
//     paddingTop: 20,
//     marginHorizontal: 0,
//     marginBottom: 20,
//   },
// });

// export default styles;

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
  return Math.max(12, Math.min(newSize, 24)); // Min 12, Max 24
};

// Responsive image size based on screen width
const getImageSize = () => {
  if (screenWidth < 420) return wp(21); // Small phones
  if (screenWidth < 450) return wp(19); // Medium phones
  if (screenWidth < 530) return wp(17); // Large phones
  return wp(16); // Tablets and larger
};

const styles = StyleSheet.create({
  screen: {
    // backgroundColor: '#F2F7FE',
    flex: 1,
  },
  scrollWrapper: {
    marginTop: hp(-10), // Responsive negative margin
    marginLeft: wp(2.5),
  },
  container: {
    backgroundColor: '#E5F1FF',
    // backgroundColor: 'red',
    flexDirection: 'row',
    borderRadius: wp(4),
    // paddingHorizontal: wp(2.5),

    // minHeight: hp(15), // Minimum height for touch targets
  },
  itemContainer: {
    // marginTop: hp(2.5),
    marginLeft: wp(3),
    marginTop: wp(3),
    marginRight: wp(3),
    alignItems: 'center',
    minWidth: wp(20), // Minimum width to prevent squishing
    // paddingVertical: hp(1.5),
  },
  selectedItem: {
    opacity: 1,
  },
  image: {
    width: getImageSize(),
    height: getImageSize(),
    borderRadius: wp(4),
    resizeMode: 'cover',
  },
  itemTitle: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    marginTop: hp(0.6),
    width: getImageSize(),
    flexWrap: 'wrap',
    lineHeight: responsiveFontSize(16),
  },
  bolditemTitle: {
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    color: '#3C5D87',
    fontWeight: '600',
    marginTop: hp(0.6),
    width: getImageSize(),
    flexWrap: 'wrap',
    lineHeight: responsiveFontSize(16),
  },
  borderBottom: {
    width: '100%',
    height: hp(0.5),
    borderRadius: wp(2.5),
    backgroundColor: '#3C5D85',
    marginTop: hp(0.6),
  },
  productsContainer: {
    backgroundColor: '#FFF',
    borderRadius: wp(5),
    paddingTop: hp(2),
    paddingHorizontal: wp(2),
    marginHorizontal: 0,
    flex: 1,

    // Android
    elevation: 10,

    // iOS
    shadowColor: '#3C5D87',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.07,
    shadowRadius: 2,
  },
  productInnerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
  },
});

export default styles;
