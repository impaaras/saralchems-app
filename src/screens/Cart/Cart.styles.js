import {StyleSheet} from 'react-native';
import {scale, verticalScale, moderateScale} from './responsive';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  menuButton: {
    marginRight: scale(15),
  },
  searchButton: {
    marginRight: scale(15),
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: scale(-8),
    top: scale(-8),
    backgroundColor: 'red',
    borderRadius: scale(10),
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  cartContent: {
    marginTop: verticalScale(-80),
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(60),
    backgroundColor: '#FFF',
    borderRadius: scale(20),
  },
  cartTitle: {
    fontSize: moderateScale(16),
    marginLeft: scale(10),
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: verticalScale(20),
  },
  addProductsText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: verticalScale(10),
  },
  cartItemsContainer: {
    marginBottom: verticalScale(10),
  },
  cartItem: {
    flexDirection: 'row',
    marginTop: verticalScale(10),
    backgroundColor: '#FFF',
    borderRadius: scale(10),
    padding: scale(10),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: verticalScale(0),
  },
  cartItemImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(5),
    marginRight: scale(10),
    backgroundColor: '#F0F0F0',
  },
  cartItemDetails: {
    flex: 1,
    marginLeft: scale(10),
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(5),
  },
  cartItemName: {
    fontSize: moderateScale(15),
    fontWeight: '500',
    width: moderateScale(230),
  },
  cartItemSpec: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(5),
  },
  cartItemQuality: {
    fontSize: moderateScale(13),
    color: '#666',
    marginBottom: verticalScale(10),
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityBtn: {
    width: scale(30),
    height: scale(30),
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityBtnText: {
    fontSize: moderateScale(16),
    color: '#3C5D87',
  },
  quantityInput: {
    width: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    marginHorizontal: 8,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },

  quantityText: {
    paddingHorizontal: scale(15),
    fontSize: moderateScale(16),
  },
  quoteButton: {
    borderRadius: scale(25),
    paddingVertical: verticalScale(12),
    alignSelf: 'center',
    alignItems: 'center',
  },
  quoteButtonText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    height: verticalScale(60),
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: moderateScale(12),
    color: '#999',
    marginTop: verticalScale(4),
  },
  activeNavItem: {
    marginTop: verticalScale(-15),
  },
  activeNavCircle: {
    width: scale(50),
    height: scale(50),
    backgroundColor: '#3C5D87',
    borderRadius: scale(25),
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
    paddingHorizontal: scale(5),
    borderRadius: scale(100),
  },
  receiptButton: {
    width: '60%',
    paddingVertical: 0,
    paddingHorizontal: scale(5),
    borderRadius: scale(100),
  },
});

export default styles;
