import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: '33%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    flexDirection: 'column',
  },
  variantsContainer: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },
  variantItem: {
    // width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 3,
    backgroundColor: '#E5F1FF',
    color: '#3C5D85',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  selectedVariantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 3,
    backgroundColor: '#3C5D85',

    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  variantText: {
    fontSize: 12,
    color: '#333',
  },
  selectedVariantText: {
    fontSize: 12,
    color: '#FFF',
  },
  moreButton: {
    backgroundColor: '#3C5D85',
    borderRadius: 3,
    width: 24,

    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 110,
    borderRadius: 8,
    // overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    right: 3,
    bottom: -10,
    zIndex: 9000,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3C5D85',
    paddingHorizontal: 10,
    paddingVertical: 1.5,
    borderRadius: 6,
    elevation: 3, // Adds a slight shadow for better visibility
  },
  addButtonText: {
    color: '#3C5D85',
    fontWeight: '600',
  },
  infoContainer: {
    flex: 1,
    marginTop: 8,
  },
  size: {
    fontSize: 10,
    backgroundColor: '#E5F1FF',
    borderRadius: 3,
    marginTop: 15,
    textAlign: 'left',
    fontWeight: '500',
    paddingHorizontal: 8,
    color: '#3C5D85',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 4,
  },
  brandInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: 10,
    color: '#333',
  },
  UnitText: {
    fontSize: 10,
    color: '#333',
  },
});

export default styles;
