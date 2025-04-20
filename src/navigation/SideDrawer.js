import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
import {Home, Profile} from '../screens';
import {ROUTES} from '../constants/routes';
import CustomDrawerContent from '../components/Drawer/SideDrawer';

const Drawer = createDrawerNavigator();

const SideDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '80%',
        },
      }}>
      <Drawer.Screen name="BottomTabs" component={BottomNavigator} />
    </Drawer.Navigator>
  );
};

export default SideDrawer;
