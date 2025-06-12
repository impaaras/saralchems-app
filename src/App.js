// import React from 'react';
// import {StatusBar, StyleSheet, View} from 'react-native';
// import Navigation from './navigation';

// const App = () => {
//   return (
//     <View style={styles.container}>
//       <Navigation />

//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F9FF',
//   },
// });

// import React, {useState} from 'react';
// import {StatusBar, StyleSheet, View} from 'react-native';
// import Navigation from './navigation';
// import Loader from './utils/Loader';

// const App = () => {
//   const [loading, setLoading] = useState(true);

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F4F9FF" />
//       <Navigation />
//       <Loader visible={loading} />
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F4F9FF',
//   },
// });

import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import Navigation from './navigation';
import Loader from './utils/Loader';
import {LoaderProvider, useLoader} from './context/LoaderContext';
import {AlertProvider} from './context/CustomAlertContext';
import GlobalAlert from './utils/Modal/GlobalAlert';

const AppContent = () => {
  const {loading, alertVisible, alertConfig, hideAlert} = useLoader();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3C5D87" barStyle="light-content" />
      <Navigation />
      <Loader visible={loading} />
    </View>
  );
};

const App = () => {
  return (
    <LoaderProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </LoaderProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
