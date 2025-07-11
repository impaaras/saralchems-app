// import React from 'react';
// import {StatusBar} from 'react-native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {ROUTES} from '../constants/routes';
// import {ItemScreen, Profile} from '../screens';
// import SideDrawer from './SideDrawer';
// import {TransitionSpecs, CardStyleInterpolators} from '@react-navigation/stack';
// import {AlertProvider} from '../context/CustomAlertContext';

// const Stack = createStackNavigator();

// const fadeTransition = {
//   gestureEnabled: true,
//   transitionSpec: {
//     open: TransitionSpecs.FadeInFromBottomAndroidSpec,
//     close: TransitionSpecs.FadeOutToBottomAndroidSpec,
//   },
//   cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
// };

// const StackNavigation = () => {
//   return (
//     <>
//       <StatusBar backgroundColor="#3C5D87" barStyle="light-content" />
//       <Stack.Navigator screenOptions={fadeTransition}>
//         <Stack.Screen
//           name="MainApp"
//           component={SideDrawer}
//           options={{headerShown: false}}
//         />
//       </Stack.Navigator>
//     </>
//   );
// };

// export default StackNavigation;

import React from 'react';
import {StatusBar} from 'react-native';
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {ROUTES} from '../constants/routes';
import {ItemScreen, Profile} from '../screens';
import SideDrawer from './SideDrawer';
import {AlertProvider} from '../context/CustomAlertContext';

const Stack = createStackNavigator();

const slideFromLeftTransition = {
  gestureEnabled: true,
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

const StackNavigation = () => {
  return (
    <>
      <StatusBar backgroundColor="#3C5D87" barStyle="light-content" />
      <Stack.Navigator screenOptions={slideFromLeftTransition}>
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
