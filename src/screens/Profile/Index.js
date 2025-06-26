// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Feather';
// import DashboardHeader from '../../components/Header/DashBoardHeader';
// import {useDispatch, useSelector} from 'react-redux';
// import {logout} from '../../redux/slices/authSlice';

// import {ROUTES} from '../../constants/routes';
// import {useNavigation} from '@react-navigation/native';
// import {fallbackImg} from '../../utils/images';
// import styles from './Profile.styles';

// const MenuItem = ({title, onPress}) => {
//   return (
//     <TouchableOpacity style={styles.menuItem} onPress={onPress}>
//       <View style={styles.menuIconContainer}>
//         <View style={styles.menuIcon} />
//       </View>
//       <Text style={styles.menuText}>{title}</Text>
//       <Icon name="chevron-right" size={20} color="#000" />
//     </TouchableOpacity>
//   );
// };

// const Profile = () => {
//   const insets = useSafeAreaInsets();
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const user = useSelector(state => state.auth.user); // Make sure the path is correct

//   // Check if user exists, else fallback to default value
//   const userName = user?.name || 'John Deo';
//   const userEmail = user?.email || 'JohnDeo@gmail.com';

//   // Logout function
//   const handleLogout = () => {
//     // navigation.navigate(ROUTES.LOGIN);
//     dispatch(logout());
//   };
//   return (
//     <>
//       <StatusBar barStyle="light-content" />
//       <DashboardHeader />
//       <View style={[styles.container, {paddingTop: insets.top}]}>
//         <View style={styles.profileContainer}>
//           <View style={styles.profileHeader}>
//             <Image
//               source={{
//                 uri: fallbackImg(),
//               }}
//               style={styles.profileAvatar}
//             />
//             <View style={styles.profileInfo}>
//               <Text style={styles.profileName}>{userName}</Text>
//               <Text style={styles.profileEmail}>{userEmail}</Text>
//             </View>
//           </View>

//           <View style={styles.divider} />

//           <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>
//           <MenuItem title="Order Traking" onPress={() => {}} />
//           <View style={styles.divider} />
//           <MenuItem title="Order history" onPress={() => {}} />
//           <View style={styles.divider} />

//           <Text style={styles.sectionTitle}>OTHER INFORMATION</Text>
//           <MenuItem title="Share the app" onPress={() => {}} />
//           <View style={styles.divider} />
//           <MenuItem title="About us" onPress={() => {}} />
//           <View style={styles.divider} />
//           <MenuItem title="Log out" onPress={handleLogout} />
//           <View style={styles.divider} />
//         </View>
//       </View>
//     </>
//   );
// };

// export default Profile;

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import DashboardHeader from '../../components/Header/DashBoardHeader';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slices/authSlice';
import {ROUTES} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import {fallbackImg} from '../../utils/images';
import {
  scale,
  verticalScale,
  moderateScale,
} from '../../utils/Responsive/responsive';

const {width: screenWidth} = Dimensions.get('window');
const MenuItem = ({title, onPress, iconName}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Icon name={iconName} size={moderateScale(20)} color="#000" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={moderateScale(20)} color="#000" />
    </TouchableOpacity>
  );
};

const Profile = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const user = useSelector(state => state.auth.user);

  const userName = user?.name || 'John Deo';
  const userEmail = user?.email || 'JohnDeo@gmail.com';

  const handleLogout = () => {
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
          <MenuItem
            title="Order Tracking"
            iconName="map-pin"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <MenuItem title="Order history" iconName="clock" onPress={() => {}} />

          <Text style={styles.sectionTitle}>OTHER INFORMATION</Text>
          <View style={styles.divider} />
          <MenuItem title="About us" iconName="info" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem title="Log out" iconName="log-out" onPress={handleLogout} />
          <View style={styles.divider} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    marginTop: verticalScale(-30),
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3b5998',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    height: verticalScale(50),
  },
  menuButton: {
    padding: moderateScale(5),
  },
  headerTitle: {
    color: 'white',
    fontSize: moderateScale(18),
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: scale(15),
  },
  profileButton: {
    position: 'relative',
  },
  headerAvatar: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: '#d3d3d3',
  },
  profileContainer: {
    backgroundColor: 'white',
    marginTop: verticalScale(-40),
    // marginHorizontal: scale(10),
    borderRadius: moderateScale(20),
    paddingBottom: verticalScale(50),
    overflow: 'hidden',
    shadowColor: '#F4F9FF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 100,
    // Ensure container doesn't exceed screen width
    // maxWidth: screenWidth - scale(20),
    // alignSelf: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(20),
    paddingVertical: verticalScale(20),
  },
  profileAvatar: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: '#d3d3d3',
  },
  profileInfo: {
    marginLeft: scale(15),
    flex: 1,
  },
  profileName: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#000',
  },
  profileEmail: {
    fontSize: moderateScale(14),
    color: '#666',
    marginTop: verticalScale(4),
  },
  divider: {
    height: 1,
    marginHorizontal: scale(20),
    backgroundColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#666',
    marginVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    minHeight: verticalScale(60),
  },
  menuIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: '#cad3e0',
  },
  menuText: {
    flex: 1,
    fontSize: moderateScale(16),
    marginLeft: scale(10),
    color: '#000',
  },
});

export default Profile;
