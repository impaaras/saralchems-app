/**
 * @format
 */
import React, {useState} from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {ErrorBoundary} from './src/components/ErrorBoundary/ErrorBoundary';

const RootApp = () => {
  const [key, setKey] = useState(0);
  global.forceAppRestart = () => setKey(prev => prev + 1);

  return (
    <ErrorBoundary key={key}>
      <App />
    </ErrorBoundary>
  );
};

AppRegistry.registerComponent(appName, () => RootApp);
