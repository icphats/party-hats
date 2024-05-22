import React, { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import WebApp from "./pages/webapp";
import Connect from "./containers/Connect";
import "./App.css";

function App() {
  const [appState, setAppState] = useState(false); //0 = nologin, 1 = locked, 2 = unlocked
  const principals = useSelector(state => state.principals);
  const currentPrincipal = useSelector(state => state.currentPrincipal);

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [loaderText, setLoaderText] = useState('');

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
      loader(true);
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
    loader(true);
    StoicIdentity.lock(principals[currentPrincipal].identity)
      .then(r => {
        setAppState(1);
        login();
      })
      .finally(() => {
        loader(false);
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
    <div className="content">
      <WebApp/>
    </div>
  );
}
export default App;