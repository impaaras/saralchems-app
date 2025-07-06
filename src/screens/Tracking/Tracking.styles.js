import {Dimensions, StyleSheet} from 'react-native';
import {scale} from '../Cart/responsive';
import {moderateScale} from '../../utils/Responsive/responsive';
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Responsive helper functions
const wp = percentage => {
  return (percentage * screenWidth) / 100;
};

const hp = percentage => {
  return (percentage * screenHeight) / 100;
};

// Device type detection
const isTablet = screenWidth >= 768;
const isSmallScreen = screenWidth < 380;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    flex: 1,
    // marginHorizontal: 16,
    marginVertical: 8,
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 100,

    zIndex: 1,
  },

  orderCard: {
    margin: wp(3),
    backgroundColor: '#FFF',
    borderRadius: wp(3),
    marginBottom: hp(2),
    overflow: 'hidden',
  },
  orderHeader: {
    paddingHorizontal: wp(2.5),
    paddingBottom: hp(1.2),
  },
  orderInfo: {
    justifyContent: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  orderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  itemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  ratingBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  itemSize: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  trackingContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  expandedTracking: {
    paddingBottom: 24,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  expandText: {
    fontSize: 14,
    color: '#3C5D87',
    fontWeight: '500',
  },
  timeline: {
    marginLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    // marginBottom: 16,
  },
  stepIconColumn: {
    alignItems: 'center',
    width: 40,
  },
  stepIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 50,
    backgroundColor: '#3C5D87',

    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLine: {
    width: 2,
    // height: 100,
    backgroundColor: '#DDD',
  },
  stepContent: {
    flex: 1,
    marginLeft: 30,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  dateContainer: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  statusLabel: {
    fontSize: 14,
    color: '#3C5D87',
    fontWeight: '500',
  },
  receiptContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3C5D87',
    borderRadius: 40,
  },
  receiptIcon: {
    marginRight: 8,
  },
  receiptText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  supportContainer: {
    marginTop: scale(32),
    marginBottom: scale(16),
    flexDirection: 'row',
    paddingHorizontal: scale(15),
    alignItems: 'center',
  },
  supportText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#666',
    textAlign: 'center',
  },
  supportButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: scale(16),
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(30),
    gap: 8,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(30),
    gap: scale(8),
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(8) : scale(10),
    color: '#757575',
  },
  orderDetails: {
    marginTop: scale(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderIdText: {
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(8) : scale(11),
    fontWeight: '600',
    color: '#212121',
  },
  orderDateText: {
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(8) : scale(10),
    color: '#001',
    fontWeight: '500',
  },
  orderValueText: {
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
    fontWeight: '500',
    color: '#001',
  },
  expandIconContainer: {
    position: 'absolute',
    right: wp(4),
    top: wp(4),
  },
  expandIcon: {
    fontSize: isTablet ? scale(16) : scale(14),
    color: '#757575',
  },
  orderItem: {
    borderWidth: 1,
    borderRadius: wp(2.5),
    borderColor: '#CCC',
    flexDirection: 'row',
    marginTop: hp(1.2),
    padding: wp(3.8),
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
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(10) : scale(11),
    fontWeight: '500',
    color: '#212121',
  },
  productSize: {
    fontSize: isTablet ? scale(12) : isSmallScreen ? scale(7) : scale(9),
    color: '#757575',
    marginTop: hp(0.5),
  },
  productQuantity: {
    fontSize: isTablet ? scale(13) : isSmallScreen ? scale(8) : scale(9),
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
    fontSize: isTablet ? 14 : isSmallScreen ? 10 : 12,
    fontWeight: '600',
  },
});
export default styles;
