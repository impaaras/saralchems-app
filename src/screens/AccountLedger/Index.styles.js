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
  ledgerContainer: {
    marginTop: verticalScale(-70),
    backgroundColor: '#FFF',
    borderRadius: scale(20),
    shadowColor: '#CCC',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.6,
    shadowRadius: scale(20),
    elevation: scale(10),
    paddingBottom: scale(20),
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: scale(15),
    marginTop: scale(15),
    gap: scale(10),
  },
  tabButton: {
    borderWidth: 1,
    borderRadius: scale(20),
    borderColor: '#DEDEDE',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(28),
    borderRadius: scale(20),
  },
  activeTab: {
    backgroundColor: '#3C5D87',
  },
  tabText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    color: '#3C5D87',
  },
  activeTabText: {
    color: '#FFF',
  },
  searchIconContainer: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    paddingHorizontal: scale(10),
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: scale(20),
    borderColor: '#DEDEDE',
  },
  searchInput: {
    fontSize: moderateScale(8),
    flex: 1,
    color: '#333',
  },
  shadowWrapper: {
    marginTop: verticalScale(15),
    marginHorizontal: scale(12),
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',

    shadowColor: '#AAA',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.01,
    shadowRadius: scale(10),
    elevation: scale(4),

    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  ledgerSection: {
    borderRadius: moderateScale(10),
    padding: scale(15),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  ledgerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: '#555555',
  },
  ledgerList: {
    maxHeight: verticalScale(300),
  },
  ledgerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  itemLeft: {
    flex: 1,
  },
  itemTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: verticalScale(8),
  },
  itemDate: {
    fontSize: moderateScale(10),
    color: '#000000',
  },
  itemDescription: {
    fontSize: moderateScale(12),
    marginVertical: scale(6),
    color: '#000',
  },
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: verticalScale(8),
  },
  payButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: scale(15),
  },
  payButtonText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  itemAmount: {
    fontSize: moderateScale(14),
    marginVertical: scale(4),
    fontWeight: '600',
  },
  bulkPaymentContainer: {
    marginTop: verticalScale(30),
    marginBottom: verticalScale(20),
    alignItems: 'center',
  },
  bulkPaymentButton: {
    backgroundColor: '#4A6FA5',
    paddingHorizontal: scale(60),
    paddingVertical: verticalScale(15),
    borderRadius: scale(25),
  },
  bulkPaymentText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default styles;
