import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthState } from '../redux/slices/authSlice';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import splashImg from '../assets/animation.gif';
import { Image, View } from 'react-native';
import FastImage from 'react-native-fast-image';


const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      await dispatch(fetchAuthState());
      setTimeout(() => {
        setLoading(false);
      }, 1500)
    };

    checkAuthState();
  }, [dispatch]);

  // Listen to changes in isAuthenticated from Redux
  useEffect(() => {
    console.log('Auth state changed:', isAuthenticated);
  }, [isAuthenticated]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <FastImage
          source={splashImg}
          style={{
            height: 400,
            width: 400
          }}
          resizeMode={'contain'}
        />
      </View>
    )
  }


  // Use the Redux state directly instead of local state
  return <>{isAuthenticated ? <StackNavigation /> : <AuthNavigator />}</>;
};

export default AppNavigator;
