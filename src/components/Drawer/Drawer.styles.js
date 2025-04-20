import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  drawerContent: {flex: 1},
  drawerHeader: {
    backgroundColor: '#3C5D87',
    borderBottomRightRadius: 20,
    padding: 15,
  },
  drawerLogo: {
    backgroundColor: '#FFF',
    borderRadius: 100,
    padding: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
  },
  drawerTitle: {color: '#FFF', fontSize: 18, fontWeight: '600'},
  menuItems: {flex: 1},
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuText: {fontSize: 16, color: '#3C5D87', fontWeight: '500'},
});

export default styles;
