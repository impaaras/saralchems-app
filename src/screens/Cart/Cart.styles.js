import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },

  menuButton: {
    marginRight: 15,
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
  cartContent: {
    marginTop: -80,
    paddingHorizontal: 15,
    marginBottom: 60,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
  cartTitle: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  addProductsText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  cartItemsContainer: {
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: 'row',
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 10,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '500',
  },
  cartItemSpec: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  cartItemQuality: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
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
  quoteButton: {
    borderRadius: 25,
    paddingVertical: 12,
    alignSelf: 'center',
    alignItems: 'center',
  },
  quoteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    height: 60,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavItem: {
    marginTop: -15,
  },
  activeNavCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#3C5D87',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavText: {
    color: '#3C5D87',
    fontWeight: '500',
  },
  confirmButton: {
    width: '30%',
    backgroundColor: '#05842A',
    paddingHorizontal: 5,
    borderRadius: 100,
  },
  receiptButton: {
    width: '60%',
    backgroundColor: '#3C5D87',
    paddingVertical: 0,
    paddingHorizontal: 5,
    borderRadius: 100,
  },
});
export default styles;
