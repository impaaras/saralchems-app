import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  headerContainer: {
    marginTop: -30,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  userInfoCard: {
    marginTop: -50,
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  userTextContainer: {
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 4,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 25,
  },
  activeTabButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 100,
  },
  tabText: {
    fontSize: 13,
    color: '#555555',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  ordersContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 100,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  orderHeader: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  orderStatus: {
    fontSize: 14,
    color: '#757575',
  },
  orderDetails: {
    marginTop: 8,
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
    fontWeight: '500',
  },
  orderValueText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#001',
  },
  expandIconContainer: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  expandIcon: {
    fontSize: 16,
    color: '#757575',
  },
  orderItemsContainer: {
    // marginTop: 10,
    // backgroundColor: 'white',
  },
  orderItem: {
    borderWidth: 1,
    // backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#CCC',
    flexDirection: 'row',
    marginTop: 10,
    padding: 15,
    // marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
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
    marginTop: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginTop: 4,
  },
  ratingContainer: {
    // backgroundColor: '#1E3A8A',
    height: 20,
    width: 30,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quoteButton: {
    borderRadius: 25,
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: '30%',
    backgroundColor: '#05842A',
    paddingHorizontal: 5,
    borderRadius: 100,
  },
  quoteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3C5D87',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    color: '#555',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
  },
  submitButton: {
    backgroundColor: '#3C5D87',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  messageText: {
    textAlign: 'center',
    padding: 20,
    color: '#555',
  },
  errorText: {
    textAlign: 'center',
    padding: 20,
    color: 'red',
  },
});

export default styles;
