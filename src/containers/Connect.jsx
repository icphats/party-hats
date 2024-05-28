import React from 'react';
import ConnectList from '../components/Profile/ConnectList.jsx';

import { StoicIdentity } from '../ic/identity.js';
import { useDispatch } from 'react-redux'

function Connect(props) {
  const [open, setOpen] = React.useState(true);
  const [initialRoute, setInitialRoute] = React.useState('');
  const dispatch = useDispatch()
  const submit = (type, optdata) => {
    props.loader(true);
    StoicIdentity.setup(type, optdata).then(identity => {
      dispatch({ type: 'createwallet', payload : {identity : identity}});
      props.login();
    }).catch(e => {
      console.log(e);
    }).finally(() => {
      setTimeout(() => {
        setOpen(true);
        props.loader(false)
      }, 2000);
    });
  };
  const error = (e) => {
    props.alert("There was an error", e);
  }
  const cancel = (t) => {
    setInitialRoute('');
    setOpen(true);
  };
  const handleClick = (t) => {
    setOpen(false);
    switch(t) {
      case "link":
        props.loader(true);
        StoicIdentity.setup("ii").then(identity => {
          dispatch({ type: 'createwallet', payload : {identity : identity}});
          props.login();
          props.loader(false);
          setOpen(true)
        }).catch(e => {
          console.log(e);
        }).finally(() => {
          setOpen(true)
          props.loader(false)
        });
      break;
      case "connect":
        //Show error
        error("Hardware wallet support is coming soon!")
        setOpen(true)
      break;
      default: break;
    }
  };
  return (
    <>
      <div>
        <div>
          <ConnectList handler={handleClick} />
        </div>
      </div>
      {/* <WalletDialog hideBackdrop alert={props.alert} initialRoute={initialRoute} cancel={cancel} submit={submit} /> */}
    </>
  );
}

export default Connect;
