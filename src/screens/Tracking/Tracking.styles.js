import {StyleSheet} from 'react-native';

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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    padding: 16,
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
    fontWeight: '600',
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

    marginLeft: 12,
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
    paddingVertical: 8,

    paddingHorizontal: 16,
    borderRadius: 20,
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
    marginTop: 24,
  },
  supportText: {
    fontSize: 16,
    color: '#666',

    textAlign: 'center',
  },
  supportButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingVertical: 8,
    // paddingHorizontal: 16,
    borderRadius: 4,
    gap: 8,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  orderDetails: {
    // marginTop: 8,

    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
  },

  orderDateText: {
    fontSize: 13,
    color: '#001',
    textAlign: 'right',
    fontWeight: '500',
  },
  orderValueText: {
    fontSize: 13,
    textAlign: 'right',
    fontWeight: '500',
    color: '#001',
  },
  ratingContainer: {
    backgroundColor: '#1E3A8A',
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  orderItem: {
    borderWidth: 1,
    // backgroundColor: 'white',
    // borderRadius: 10,
    padding: 10,

    borderRadius: 8,
    borderColor: '#CCC',
    flexDirection: 'row',
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
  productSize: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
  productQuantity: {
    fontSize: 13,
    color: '#757575',
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginTop: 4,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
});
export default styles;
