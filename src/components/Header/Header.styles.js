import {StyleSheet} from 'react-native';
import {
  moderateScale,
  scale,
  verticalScale,
} from '../../utils/Responsive/responsive';

const styles = StyleSheet.create({
  headerContainer: {
    paddingVertical: 16,
    paddingBottom: 100,
    borderBottomEndRadius: 40,
    borderBottomLeftRadius: 40,
    backgroundColor: '#3C5D87',
  },

  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: 8,
    height: scale(40),
  },
  menuContainer: {
    borderWidth: 1,
    borderColor: '#FCFCFC33',
    padding: moderateScale(6),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: '#FFF',
    fontWeight: '500',
    marginLeft: scale(10),
  },
  searchButton: {
    borderWidth: 1,
    borderColor: '#FCFCFC33',
    padding: moderateScale(6),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -2,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    // marginRight: 12,
    borderRightWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  // Add these to your existing styles
  backButton: {
    borderWidth: 1,
    marginLeft: scale(3),
    borderColor: '#FCFCFC33',
    padding: moderateScale(5),
    borderRadius: 100,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 9999999,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
    paddingLeft: 10,
    backgroundColor: '#FFF',
    borderRadius: 100,
  },
  searchInput: {
    paddingVertical: 10,
    height: 40,
    flex: 1,
  },
  clearButton: {
    paddingHorizontal: 10,
  },
  clearText: {
    fontSize: 22,
    color: '#555',
  },
});

export default styles;
