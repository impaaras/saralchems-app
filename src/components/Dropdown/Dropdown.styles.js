import {StyleSheet} from 'react-native';
import {moderateScale} from '../../utils/Responsive/responsive';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '95%',
    // marginLeft: -10,
    marginLeft: 10,
    zIndex: 999999,
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFF',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  dropdownListContainer: {
    backgroundColor: '#173A66',
    zIndex: 99999,
    borderRadius: 20,
    paddingVertical: 10,
    width: '100%',
    position: 'absolute',
    top: '100%',
    left: 0,
    elevation: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // maxHeight: 300, // Added for scroll if many categories
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    color: 'white',
    fontSize: moderateScale(12),
  },
  activeItem: {
    backgroundColor: '#3C5D87',
    borderRadius: 30,
    marginVertical: 0,
    marginHorizontal: 6,
  },
  activeItemText: {
    fontSize: moderateScale(12),

    fontWeight: '600',
  },
});
export default styles;
