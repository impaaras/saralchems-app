import React, {createContext, useContext, useState} from 'react';

import GlobalAlert from '../utils/Modal/GlobalAlert';

const AlertContext = createContext();

export const AlertProvider = ({children}) => {
  const [alertConfig, setAlertConfig] = useState({});
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = config => {
    setAlertConfig(config);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return (
    <AlertContext.Provider value={{showAlert, hideAlert}}>
      {children}
      <GlobalAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        // onConfirm={() => {
        // alertConfig.onConfirm && alertConfig.onConfirm();
        // hideAlert();
        // }}
        onAccept={() => {
          alertConfig.onConfirm && alertConfig.onConfirm();
          hideAlert();
        }}
        onReject={() => {
          alertConfig.onReject && alertConfig.onReject();
          hideAlert();
        }}
        onClose={() => {
          alertConfig.onCancel && alertConfig.onCancel();
          hideAlert();
        }}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
