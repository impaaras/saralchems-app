import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Navigation from './navigation';
import Loader from './utils/Loader';
import {LoaderProvider, useLoader} from './context/LoaderContext';
import {AlertProvider} from './context/CustomAlertContext';
import GlobalAlert from './utils/Modal/GlobalAlert';
import NoInternetScreen from './screens/NoInternet/Index';

const AppContent = () => {
  const {loading} = useLoader();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <NoInternetScreen
        onRetry={() =>
          NetInfo.fetch().then(state => setIsConnected(state.isConnected))
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#3C5D87" barStyle="light-content" />
      <Navigation />
      {/* <Loader visible={loading} /> */}
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
