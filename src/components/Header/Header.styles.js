import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    // paddingHorizontal: 8,
    // zIndex: 0,
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
    height: 48,
  },
  menuContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 0.8,
    borderColor: '#617D9E',

    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    // elevation: 2,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 10,
  },
  searchButton: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#617D9E',
    borderRadius: 100,
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
});

export default styles;
