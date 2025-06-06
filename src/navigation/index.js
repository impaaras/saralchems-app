import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from '../redux/store';
import AppNavigator from './AppNavigator';
import GlobalModal from '../utils/Modal/GlobalModal';
import {
  navigationRef,
  onNavigationReady,
  onStateChange,
} from './navigationService';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={onNavigationReady}
        onStateChange={onStateChange}>
        <AppNavigator />
        <GlobalModal />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
