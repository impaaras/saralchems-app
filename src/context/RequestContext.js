import {createContext, useContext, useState} from 'react';
import CustomerRequipment from '../utils/Modal/CustomerRequipment/CustomerRequipment';

export const RequestContext = createContext();

export const RequestProvider = ({children}) => {
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
    <RequestContext.Provider value={{showAlert, hideAlert}}>
      {children}
      <CustomerRequipment
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
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
    </RequestContext.Provider>
  );
};

export const useRequest = () => useContext(RequestContext);
