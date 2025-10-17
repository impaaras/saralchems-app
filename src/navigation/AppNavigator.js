import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import StackNavigation from './StackNavigation';
import AuthNavigator from './AuthNavigator';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import FastImage from '../components/FastImage/FastImage';

const AppNavigator = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const [loading, setLoading] = useState(true);

  if (loading) {
    return <FastImage setLoading={setLoading} />;
  }

  return <>{isAuthenticated ? <StackNavigation /> : <AuthNavigator />}</>;
};

export default AppNavigator;
