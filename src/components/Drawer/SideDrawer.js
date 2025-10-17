import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';
import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import styles from './Drawer.styles';
import {useAlert} from '../../context/CustomAlertContext';

const {width} = Dimensions.get('window');

const MenuItem = ({title, onPress, isLast}) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast ? styles.lastMenuItem : null]}
    onPress={onPress}>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

// This component should only be the drawer content, not the whole drawer structure
const CustomDrawerContent = props => {
  const dispatch = useDispatch();
  const {navigation} = props;
  const navig = useNavigation();

  const {showAlert} = useAlert();

  const handleLogout = () => {
    showAlert({
      title: 'Are you sure?',
      message: 'Do you want to logout?',
      onConfirm: async () => {
        dispatch(logout());
        navigation.closeDrawer();
      },
      acceptText: 'Yes',
      rejectText: 'Cancel',
    });
  };

  const navigateTo = routeName => {
    navigation.closeDrawer();
    navigation.navigate('BottomTabs', {screen: routeName});
  };

  const menuItems = [
    {title: 'Home', route: 'Home'},
    {title: 'Products', route: 'products'},
    {title: 'Account Ledger', route: ROUTES.LEDGER},
    {title: 'Order History', route: ROUTES.HISTORY},
    {title: 'My Profile', route: ROUTES.PROFILE},
    {title: 'Logout', action: handleLogout},
  ];

  return (
    <SafeAreaView style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={styles.drawerLogo}
          onPress={() => navigation.closeDrawer()}>
          <Image
            source={logo}
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            title={item.title}
            isLast={index === menuItems.length - 1}
            onPress={item.action ? item.action : () => navigateTo(item.route)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
