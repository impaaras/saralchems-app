// import React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {Provider} from 'react-redux';
// import {store} from '../redux/store';
// import AppNavigator from './AppNavigator';
// import GlobalModal from '../utils/Modal/GlobalModal';
// import {
//   navigationRef,
//   onNavigationReady,
//   onStateChange,
// } from './navigationService';
// import DashboardHeader from '../components/Header/DashBoardHeader';

// const App = () => {
//   return (
//     <Provider store={store}>
//       <NavigationContainer
//         ref={navigationRef}
//         onReady={onNavigationReady}
//         onStateChange={onStateChange}>
//         <AppNavigator />
//         <GlobalModal />
//       </NavigationContainer>
//     </Provider>
//   );
// };

// export default App;

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider, useSelector} from 'react-redux';
import {store} from '../redux/store';
import AppNavigator from './AppNavigator';
import GlobalModal from '../utils/Modal/GlobalModal';
import {
  navigationRef,
  onNavigationReady,
  onStateChange,
} from './navigationService';
import DashboardHeader from '../components/Header/DashBoardHeader';

// Separate component to use useSelector
const ConditionalGlobalModal = () => {
  const isModalOpen = useSelector(state => state.modal.isOpen);

  // Only render GlobalModal when it's actually needed
  return isModalOpen ? <GlobalModal /> : null;
};

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        onReady={onNavigationReady}
        onStateChange={onStateChange}>
        <AppNavigator />
        <ConditionalGlobalModal />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
