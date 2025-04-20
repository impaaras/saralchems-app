import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slices/authSlice';

import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {fallbackImg} from '../../utils/images';
import styles from './Profile.styles';

const MenuItem = ({title, onPress}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <View style={styles.menuIcon} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={20} color="#000" />
    </TouchableOpacity>
  );
};

const Profile = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(state => state.auth.user); // Make sure the path is correct

  console.log('users', user);

  // Check if user exists, else fallback to default value
  const userName = user?.name || 'John Deo';
  const userEmail = user?.email || 'JohnDeo@gmail.com';

  // Logout function
  const handleLogout = () => {
    // navigation.navigate(ROUTES.LOGIN);
    dispatch(logout());
  };
  return (
    <>
      <StatusBar barStyle="light-content" />
      <DashboardHeader />
      <View style={[styles.container, {paddingTop: insets.top}]}>
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: fallbackImg(),
              }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileEmail}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>
          <MenuItem title="Order Traking" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem title="Order history" onPress={() => {}} />
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>OTHER INFORMATION</Text>
          <MenuItem title="Share the app" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem title="About us" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem title="Log out" onPress={handleLogout} />
          <View style={styles.divider} />
        </View>
      </View>
    </>
  );
};

export default Profile;
