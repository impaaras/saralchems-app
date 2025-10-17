// import React, {createContext, useContext, useState} from 'react';

// import GlobalAlert from '../utils/Modal/GlobalAlert';

// const AlertContext = createContext();

// export const AlertProvider = ({children}) => {
//   const [alertConfig, setAlertConfig] = useState({});
//   const [alertVisible, setAlertVisible] = useState(false);

//   const showAlert = config => {
//     setAlertConfig(config);
//     setAlertVisible(true);
//   };

//   const hideAlert = () => {
//     setAlertVisible(false);
//   };

//   return (
//     <AlertContext.Provider value={{showAlert, hideAlert}}>
//       {children}
//       <GlobalAlert
//         visible={alertVisible}
//         title={alertConfig.title}
//         message={alertConfig.message}
//         onAccept={() => {
//           if (alertConfig.onAccept) {
//             alertConfig.onAccept();
//           } else if (alertConfig.onConfirm) {
//             alertConfig.onConfirm();
//           }
//           hideAlert();
//         }}
//         onReject={() => {
//           alertConfig.onReject && alertConfig.onReject();
//           hideAlert();
//         }}
//         onClose={() => {
//           alertConfig.onCancel && alertConfig.onCancel();
//           hideAlert();
//         }}
//       />
//     </AlertContext.Provider>
//   );
// };

// export const useAlert = () => useContext(AlertContext);

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
        acceptText={alertConfig.acceptText}
        rejectText={alertConfig.rejectText}
        onAccept={async () => {
          try {
            if (alertConfig.onAccept) {
              await alertConfig.onAccept();
            } else if (alertConfig.onConfirm) {
              await alertConfig.onConfirm();
            }
          } catch (error) {
            console.error('Error in onAccept:', error);
          }
          hideAlert();
        }}
        onReject={() => {
          if (alertConfig.onReject) {
            alertConfig.onReject();
          }
          hideAlert();
        }}
        onClose={() => {
          if (alertConfig.onCancel) {
            alertConfig.onCancel();
          }
          hideAlert();
        }}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
