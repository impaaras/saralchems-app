import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: width,
    position: 'relative',
  },
  scrollContent: {
    paddingRight: SPACING, // Add padding at the end
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: 200,
    marginRight: SPACING, // Space between items
  },
  image: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
});

export default styles;
