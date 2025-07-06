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
import {useAlert} from '../../context/CustomAlertContext';

const {width: screenWidth} = Dimensions.get('window');
const MenuItem = ({title, onPress, iconName}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <View style={styles.menuIcon}></View>
        {/* <Icon name={iconName} size={moderateScale(16)} color="#000" /> */}
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Icon name="chevron-right" size={moderateScale(18)} color="#000" />
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

  const {showAlert} = useAlert();
  const handleLogout = () => {
    showAlert({
      title: 'Are you sure?',
      message: 'Do you want to logout?',
      onConfirm: async () => {
        dispatch(logout());
      },
      acceptText: 'Yes',
      rejectText: 'Cancel',
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <DashboardHeader />
      <View style={[styles.container, {paddingTop: 0}]}>
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
          <View style={{paddingHorizontal: scale(5)}}>
            <Text style={styles.sectionTitle}>YOUR INFORMATION</Text>
            <View style={{paddingHorizontal: scale(20)}}>
              <MenuItem
                title="Order Tracking"
                iconName="map-pin"
                onPress={() => {}}
              />
              <MenuItem
                title="Order history"
                iconName="clock"
                onPress={() => {}}
              />
            </View>
            <Text style={styles.sectionTitle}>OTHER INFORMATION</Text>
            <View style={{paddingHorizontal: scale(20)}}>
              <MenuItem title="About us" iconName="info" onPress={() => {}} />
              <MenuItem
                title="Log out"
                iconName="log-out"
                onPress={handleLogout}
              />
            </View>
          </View>
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
    backgroundColor: '#FFF',
    marginTop: verticalScale(-40),
    borderRadius: moderateScale(20),
    paddingBottom: verticalScale(50),
    overflow: 'hidden',
    // ✅ iOS Shadow
    shadowColor: '#CCC',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // ✅ Android Shadow
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding: moderateScale(20),
    paddingVertical: verticalScale(20),
    marginHorizontal: scale(20),
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
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
    fontSize: moderateScale(14),
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
    backgroundColor: '#000000',
  },
  sectionTitle: {
    fontSize: moderateScale(15),
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
    paddingHorizontal: scale(5),
    marginHorizontal: scale(6),
    borderBottomColor: '#AAA',
    borderBottomWidth: 1,
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
    backgroundColor: '#3B5C8580',
  },
  menuText: {
    flex: 1,
    fontSize: moderateScale(15),
    marginLeft: moderateScale(5),
    color: '#000',
  },
});

export default Profile;
