// ProductDetail.styles.js
import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  productContent: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: '100%',
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  productInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  detailsRow: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  skuRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  skuValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginLeft: 5,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  customInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#1B2B48',
    borderColor: '#1B2B48',
  },
  optionButtonText: {
    color: '#5A5A5A',
    fontSize: 14,
  },
  selectedOptionText: {
    color: '#FFF',
    fontSize: 14,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1B2B48',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  orderButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FF5722',
    borderRadius: 20,
    marginLeft: 10,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  productType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  featureHighlight: {
    fontWeight: '600',
    color: '#333',
  },
  specItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#5A5A5A',
    width: 120,
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  bottomActions: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  totalQty: {
    marginBottom: 10,
  },
  totalQtyText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 15,
  },
  quantityBtn1: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#DDD',
  },
  quantityBtn2: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#DDD',
  },
  quantityBtnText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B2B48',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 15,
  },
  addToCartButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;
