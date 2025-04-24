import {Dimensions, StyleSheet} from 'react-native';
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
    backgroundColor: '#CCC',
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
    width: '90%',
    height: '90%',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailsRow: {
    marginBottom: 15,
    backgroundColor: '#E5F1FF',
    padding: 10,
    borderRadius: 6,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
    width: 30,
    height: 30,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  productType: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    marginLeft: 8,
    flex: 1,
  },
  featureHighlight: {
    fontWeight: '600',
    color: '#333',
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 120,
  },
  specValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  bottomActions: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    // flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 15,

    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    alignItems: 'center',
  },
  totalQty: {
    marginBottom: 10,
  },
  totalQtyText: {
    fontSize: 16,
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
    fontSize: 16,
    color: '#3C5D87',
  },
  quantityText: {
    paddingHorizontal: 15,
    fontSize: 16,
  },
  addToCartButton: {
    // backgroundColor: '#3C5D87',

    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 14,
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
    backgroundColor: '#FFF',
  },
  optionButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 5,

    borderWidth: 1,
    borderColor: '#D0E4FF',
  },
  selectedOption: {
    backgroundColor: '#3C5D86',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
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
});

export default styles;
