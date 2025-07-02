import {StyleSheet, Dimensions} from 'react-native';

// Get screen dimensions
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
  // filterContainer: {
  //   marginHorizontal: wp(4),
  //   marginBottom: hp(1),
  //   zIndex: 1000,
  //   position: 'absolute',
  //   right: 50,
  //   left: 50,
  // },
  // filterContainer: {
  //   zIndex: 1000,
  //   paddingHorizontal: wp(2),
  // },

  // dropdownToggle: {
  //   zIndex: 1001,
  //   // width: wp(40),
  // },
  // dropdownButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   borderRadius: wp(2.5),
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  // },
  // dropdownButtonText: {
  //   color: '#FFF',
  //   paddingHorizontal: wp(4),
  //   paddingVertical: hp(1.5),
  //   fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
  //   fontWeight: '600',
  // },
  // dropdownMenu: {
  //   position: 'relative',
  //   top: 0,
  //   left: 0,
  //   backgroundColor: '#FFF',
  //   borderRadius: wp(2.5),
  //   marginTop: hp(0.5),
  //   elevation: 8,
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 4},
  //   shadowOpacity: 0.15,
  //   shadowRadius: 8,
  //   borderWidth: 1,
  //   borderColor: '#E0E0E0',
  //   overflow: 'hidden',
  //   maxHeight: hp(42),
  // },
  // dropdownItem: {
  //   paddingHorizontal: wp(4),
  //   paddingVertical: hp(1.5),
  //   borderBottomWidth: 0.5,
  //   borderBottomColor: '#F0F0F0',
  // },
  // lastDropdownItem: {
  //   borderBottomWidth: 0,
  // },
  // activeDropdownItem: {
  //   backgroundColor: '#F8F9FA',
  // },
  // dropdownItemContent: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  // },
  // dropdownItemText: {
  //   fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
  //   color: '#333',
  //   fontWeight: '500',
  // },
  // activeDropdownItemText: {
  //   color: '#38587F',
  //   fontWeight: '600',
  // },
  // dropdownOverlay: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   backgroundColor: 'transparent',
  //   zIndex: 999,
  // },
  filterTabsContainer: {
    paddingHorizontal: wp(2),
  },

  tabScrollContainer: {
    flexDirection: 'row',
  },

  tabButton: {
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#DADADA',
  },

  activeGradient: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(5),
  },

  activeTabButton: {
    borderWidth: 0,
  },

  activeTabText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    textAlign: 'center',
  },

  inactiveTabText: {
    color: '#333',
    fontWeight: '500',
    fontSize: isTablet ? 16 : isSmallScreen ? 11 : 13,
    textAlign: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    borderRadius: wp(5),
  },

  container: {
    flex: 1,
    zIndex: 1,
  },
  headerContainer: {
    marginTop: hp(-4),
    borderRadius: wp(3),
    backgroundColor: '#FFF',
  },
  pageTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '600',
    color: 'white',
  },
  userInfoCard: {
    marginTop: hp(-6),
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
    margin: wp(4),
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(10),
    backgroundColor: '#E0E0E0',
  },
  userTextContainer: {
    marginLeft: wp(4),
    flex: 1,
  },
  userName: {
    fontSize: isTablet ? 18 : isSmallScreen ? 14 : 16,
    fontWeight: '600',
    color: '#212121',
  },
  userEmail: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    color: '#757575',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(2),
    backgroundColor: 'white',
    borderRadius: wp(6.25),
    // padding: wp(1),
  },
  tabButton: {
    flex: 1,
    // marginRight: wp(1),
    marginHorizontal: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: wp(6.25),
    borderWidth: 1,
    borderColor: '#CCC',
  },

  activeTabButton: {
    borderWidth: 0,
  },
  tabText: {
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
    color: '#555555',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  ordersContainer: {
    backgroundColor: '#FFF',
    marginTop: hp(0.5),
    paddingBottom: hp(12),
    paddingTop: hp(1.2),
    paddingHorizontal: wp(2.5),
    minHeight: hp(50),
    borderBottomLeftRadius: wp(3),
    borderBottomRightRadius: wp(3),

    //anroid
    elevation: 5,

    // iOS
    shadowColor: '#3C5D87',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    marginRight: wp(2),
  },
  orderStatus: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    color: '#757575',
  },
  orderDetails: {
    marginTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderIdText: {
    fontSize: isTablet ? 17 : isSmallScreen ? 13 : 15,
    fontWeight: '600',
    color: '#212121',
  },
  orderDateText: {
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
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
    fontSize: isTablet ? 18 : 16,
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
    justifyContent: 'center',
  },
  productName: {
    fontSize: isTablet ? 17 : isSmallScreen ? 13 : 15,
    fontWeight: '500',
    color: '#212121',
  },
  productSize: {
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
    color: '#757575',
    marginTop: hp(0.5),
  },
  productQuantity: {
    fontSize: isTablet ? 15 : isSmallScreen ? 11 : 13,
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
  quoteButton: {
    borderRadius: wp(6.25),
    paddingVertical: hp(1.2),
    alignSelf: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: isSmallScreen ? '100%' : '45%',
    borderRadius: wp(25),
  },
  quoteButtonText: {
    fontSize: isTablet ? 16 : isSmallScreen ? 12 : 14,
    fontWeight: '500',
  },

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
  messageText: {
    textAlign: 'center',
    padding: wp(5),
    color: '#555',
    fontSize: isTablet ? 16 : 14,
  },
  errorText: {
    textAlign: 'center',
    padding: wp(5),
    color: 'red',
    fontSize: isTablet ? 16 : 14,
  },
  emptyContainer: {
    // flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    // backgroundColor: '#F5F7FA',
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1B2B48',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6E7A8A',
    textAlign: 'center',
    marginBottom: 30,
  },
  goBackButton: {
    // backgroundColor: '#FDBD34',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    // elevation: 2,
  },
  goBackText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default styles;
