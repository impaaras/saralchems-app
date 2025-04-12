import React from 'react';
import {StatusBar} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from '../constants/routes';
import {ItemScreen, Profile} from '../screens';
import SideDrawer from './SideDrawer';
import {TransitionSpecs, CardStyleInterpolators} from '@react-navigation/stack';

const Stack = createStackNavigator();

const fadeTransition = {
  gestureEnabled: true,
  transitionSpec: {
    open: TransitionSpecs.FadeInFromBottomAndroidSpec,
    close: TransitionSpecs.FadeOutToBottomAndroidSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};

const StackNavigation = () => {
  return (
    <>
      <StatusBar backgroundColor="#3C5D87" barStyle="light-content" />
      <Stack.Navigator screenOptions={fadeTransition}>
        <Stack.Screen
          name="MainApp"
          component={SideDrawer}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;
