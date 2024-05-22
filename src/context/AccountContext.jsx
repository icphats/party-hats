import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const AccountContext = createContext();

export const useAccountContext = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {

  const emptyAlert = {
    title: '',
    message: '',
};

  const principals = useSelector(state => state.principals);
  const currentPrincipal = useSelector(state => state.currentPrincipal);
  const dispatch = useDispatch();

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [appState, setAppState] = useState(false); // 0 = no login, 1 = locked, 2 = unlocked
  const [loaderText, setLoaderText] = useState('');
  const [alertData, setAlertData] = useState(emptyAlert);
  const [confirmData, setConfirmData] = useState(emptyAlert);
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loader = (l, t) => {
    setLoaderText(t);
    setLoaderOpen(l);
    if (!l) {
      setLoaderText('');
    }
  };

  const login = () => {
    if (principals.length === 0) {
      setAppState(0);
    } else {
      loader(true, 'Logging in...');
      StoicIdentity.load(principals[currentPrincipal].identity)
        .then(i => {
          extjs.connect(
            'https://icp0.io/',
            StoicIdentity.getIdentity(principals[currentPrincipal].identity.principal),
          );
          setAppState(2);
        })
        .catch(e => {
          setAppState(1);
        })
        .finally(() => loader(false));
    }
  };

  const logout = () => {
    loader(true, 'Logging out...');
    StoicIdentity.lock(principals[currentPrincipal].identity)
      .then(r => {
        setAppState(1);
        login();
      })
      .finally(() => {
        loader(false);
      });
  };

  const remove = () => {
    loader(true, 'Removing...');
    StoicIdentity.clear(principals[currentPrincipal].identity).then(r => {
      setAppState(0);
      loader(false);
      setTimeout(() => {
        dispatch({ type: 'removewallet' });
      }, 1000); // Timeout to clear views...
    });
  };

  const alert = (title, message, buttonLabel) => {
    return new Promise((resolve) => {
      setAlertData({
        title: title,
        message: message,
        buttonLabel: buttonLabel,
        handler: () => {
          setShowAlert(false);
          resolve(true);
          setTimeout(() => setAlertData(emptyAlert), 100);
        },
      });
      setShowAlert(true);
    });
  };

  const confirm = (title, message, buttonCancel, buttonConfirm) => {
    return new Promise((resolve) => {
      setConfirmData({
        title: title,
        message: message,
        buttonCancel: buttonCancel,
        buttonConfirm: buttonConfirm,
        handler: (v) => {
          setShowConfirm(false);
          resolve(v);
          setTimeout(() => setConfirmData(emptyAlert), 100);
        },
      });
      setShowConfirm(true);
    });
  };

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    login();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrincipal, principals]);

  return (
    <AccountContext.Provider
      value={{
        loaderOpen,
        appState,
        loaderText,
        alertData,
        confirmData,
        showAlert,
        showConfirm,
        alert,
        confirm,
        login,
        loader,
        logout,
        remove,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
