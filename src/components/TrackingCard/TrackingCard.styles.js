import {Dimensions, StyleSheet} from 'react-native';
import {
  scale,
  hp,
  wp,
  isTablet,
  isSmallScreen,
  verticalScale,
  moderateScale,
} from '../../utils/Responsive/responsive';

const styles = StyleSheet.create({
  ordersContainer: {
    backgroundColor: '#FFF',
    marginTop: hp(0.5),
    paddingBottom: hp(12),
    paddingTop: hp(1.2),
    paddingHorizontal: wp(2.5),
    minHeight: hp(50),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: '#FFF',
    borderRadius: wp(3),
    marginBottom: hp(2),
    overflow: 'hidden',

    // ✅ iOS Shadow
    shadowColor: '#CCC',

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // ✅ Android Shadow
    elevation: 4,
  },
  orderHeader: {
    paddingHorizontal: wp(2.5),
    paddingBottom: hp(1.2),
  },
  statusDot: {
    width: scale(6),
    height: scale(6),
    borderRadius: wp(1.25),
    marginRight: wp(2),
  },
  orderStatus: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(9)
      : moderateScale(11),
    color: '#757575',
  },
  orderDetails: {
    marginTop: scale(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderIdText: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(10)
      : moderateScale(13),
    fontWeight: '600',
    color: '#212121',
  },
  orderDateText: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(10)
      : moderateScale(12),
    color: '#001',
    fontWeight: '500',
  },
  orderValueText: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(11)
      : moderateScale(13),
    fontWeight: '500',
    color: '#001',
  },
  expandIconContainer: {
    position: 'absolute',
    right: wp(4),
    top: wp(4),
  },
  expandIcon: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(11)
      : moderateScale(22),
    color: '#757575',
  },
  orderItem: {
    borderWidth: 1,
    borderRadius: scale(10),
    borderColor: '#CCC',
    flexDirection: 'row',
    marginTop: hp(1.2),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
  },
  productImage: {
    width: wp(17.5),
    height: wp(17.5),
    borderRadius: wp(2),
    backgroundColor: '#E0E0E0',
  },
  productDetails: {
    flex: 1,
    marginLeft: wp(4),
    justifyContent: 'space-around',
  },
  productName: {
    fontSize: isTablet
      ? moderateScale(15)
      : isSmallScreen
      ? moderateScale(11)
      : moderateScale(13),
    fontWeight: '500',
    color: '#212121',
  },
  productSize: {
    fontSize: isTablet
      ? moderateScale(12)
      : isSmallScreen
      ? moderateScale(9)
      : moderateScale(11),
    color: '#757575',
    marginTop: hp(0.5),
  },
  productQuantity: {
    fontSize: isTablet
      ? moderateScale(13)
      : isSmallScreen
      ? moderateScale(9)
      : moderateScale(11),
    color: '#757575',
    marginTop: hp(0.5),
  },
  productPrice: {
    fontSize: isTablet ? 17 : isSmallScreen ? 13 : 15,
    fontWeight: '600',
    color: '#212121',
    marginTop: hp(0.5),
  },
  ratingContainer: {
    height: hp(2.5),
    width: wp(7.5),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: 'white',
    fontSize: isTablet
      ? moderateScale(12)
      : isSmallScreen
      ? moderateScale(8)
      : moderateScale(10),
    fontWeight: '600',
  },
  quoteButton: {
    minWidth: scale(120),
    borderRadius: scale(25),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    alignSelf: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: isSmallScreen ? scale('100%') : scale('45%'),
    borderRadius: wp(25),
  },
  quoteButtonText: {
    fontSize: isTablet
      ? moderateScale(12)
      : isSmallScreen
      ? moderateScale(8)
      : moderateScale(12),
    fontWeight: '500',
  },

  // Modal css

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: wp(2.5),
    padding: wp(5),
    width: isTablet ? '80%' : '100%',
    maxWidth: isTablet ? 500 : 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    marginBottom: hp(1.2),
    color: '#3C5D87',
  },
  modalSubtitle: {
    fontSize: isTablet ? 16 : 14,
    marginBottom: hp(1.8),
    color: '#555',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(1.25),
    padding: wp(2.5),
    marginBottom: hp(2.4),
    textAlignVertical: 'top',
    height: hp(12),
    fontSize: isTablet ? 16 : 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: hp(1.4),
    borderRadius: wp(1.25),
    alignItems: 'center',
    marginHorizontal: wp(1.25),
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: wp(25),
  },
  submitButton: {
    // backgroundColor: '#3C5D87',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: isTablet ? 16 : 14,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: isTablet ? 16 : 14,
  },
});

export default styles;
