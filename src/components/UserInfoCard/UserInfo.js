import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fallbackImg} from '../../utils/images';
import {
  hp,
  isSmallScreen,
  isTablet,
  scale,
  wp,
} from '../../utils/Responsive/responsive';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../constants/routes';

const UserInfo = ({screenName}) => {
  const user = useSelector(state => state.auth.user);
  return (
    <View
      style={[
        styles.userInfoCard,
        {
          marginTop: screenName === ROUTES.LEDGER ? scale(14) : scale(-40),
          margin: scale(15),
          padding: scale(15),
        },
      ]}>
      <Image
        source={{
          uri: fallbackImg(),
        }}
        style={[styles.userAvatar]}
      />
      <View style={[styles.userTextContainer]}>
        <Text style={[styles.userName]}>{user?.name}</Text>
        <Text style={[styles.userEmail]}>{user?.email}</Text>
      </View>
    </View>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  userInfoCard: {
    marginTop: hp(-6),
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
    margin: wp(4),
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0017',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 10,
  },
  userAvatar: {
    width: wp(17),
    height: wp(17),
    borderRadius: wp(10),
    backgroundColor: '#E0E0E0',
  },
  userTextContainer: {
    marginLeft: scale(10),
    flex: 1,
  },
  userName: {
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(12) : scale(14),
    fontWeight: '600',
    color: '#212121',
  },
  userEmail: {
    fontSize: isTablet ? scale(15) : isSmallScreen ? scale(12) : scale(14),
    color: '#757575',
  },
});
