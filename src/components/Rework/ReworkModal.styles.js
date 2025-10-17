import {StyleSheet, Dimensions} from 'react-native';
import {
  hp,
  isSmallScreen,
  isTablet,
  moderateScale,
  scale,
  verticalScale,
  wp,
} from '../../utils/Responsive/responsive';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const styles = StyleSheet.create({
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
  confirmButton: {
    width: isSmallScreen ? '100%' : '45%',
    borderRadius: wp(25),
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
    padding: scale(6),
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
  cancelButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: isTablet ? 16 : 14,
  },
  submitButtonText: {
    color: 'white',

    fontWeight: '500',
    fontSize: moderateScale(16),
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
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1B2B48',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: '#6E7A8A',
    textAlign: 'center',
    marginBottom: 30,
  },
  goBackButton: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(8),
    borderRadius: 24,
  },
  goBackText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
});

export default styles;
