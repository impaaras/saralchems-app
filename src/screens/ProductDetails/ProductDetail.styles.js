import {Dimensions, StyleSheet} from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../utils/Responsive/responsive';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: -103,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#3C5D87',
  },
  menuButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 15,
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productContent: {
    // flex: 1,
    marginTop: -80,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    padding: 15,
  },
  imageContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    // backgroundColor: '#EEE',

    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#333',
    marginTop: scale(10),
  },
  detailsRow: {
    marginVertical: verticalScale(8),
    backgroundColor: '#E5F1FF',
    padding: 10,
    borderRadius: 6,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  detailValue: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: '#333',
  },

  skuRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 10,
  },
  listVariant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  skuContainer: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    width: 70,
  },
  skuLabel: {
    fontSize: 12,
    color: '#666',
  },
  skuValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    fontSize: 14,
    padding: 0,
    height: 20,
  },
  plusButton: {
    backgroundColor: '#3C5D87',
    width: scale(30),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 10,
  },
  orderButton: {
    backgroundColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  blurWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
  },
  comingSoon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: scale(16),
    fontWeight: '600',
    color: '#001',
    textAlign: 'center',
    zIndex: 9999,
  },
  productType: {
    fontSize: scale(14),
    fontWeight: '500',
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sectionText: {
    fontSize: scale(12),
    lineHeight: scale(16),
    color: '#555',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: scale(12),
    lineHeight: scale(16),
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  featureHighlight: {
    fontSize: scale(12),
    lineHeight: scale(16),
    fontWeight: '600',
    color: '#333',
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  specLabel: {
    fontSize: scale(12),
    fontWeight: '500',
    color: '#333',
    width: 120,
  },
  specValue: {
    fontSize: scale(12),
    color: '#555',
    flex: 1,
  },
  bottomActions: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingBottom: 20,
    alignItems: 'center',
  },
  totalQty: {
    marginBottom: 10,
  },
  totalQtyText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderColor: '#CCC',
    marginRight: 15,
  },
  quantityBtn1: {
    width: 30,
    height: 30,

    borderRightWidth: 1,
    borderColor: '#CCC',

    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtn2: {
    width: 30,
    height: 30,
    borderColor: '#CCC',
    borderLeftWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: moderateScale(16),
    color: '#3C5D87',
  },
  quantityText: {
    paddingHorizontal: scale(12),
    fontSize: moderateScale(14),
  },
  addToCartButton: {
    paddingVertical: scale(5),
    paddingHorizontal: scale(12),
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: scale(14),
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sectionContent: {
    paddingBottom: 15,
  },
  customInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customInput: {
    width: width * 0.5,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  selectedOption: {
    flex: 1,
    backgroundColor: '#3C5D86',
  },
  optionButtonText: {
    fontSize: moderateScale(12),
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
    fontSize: moderateScale(12),
    paddingHorizontal: 6,
    fontWeight: '500',
  },
  // New styles for image zoom
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: width,
    height: '80%',
  },
  // Add these styles to your existing ProductDetail.styles.js file

  imageSlideContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  zoomIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 5,
  },
});

export default styles;
