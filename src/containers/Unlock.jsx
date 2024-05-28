import React from 'react';
import {StoicIdentity} from '../ic/identity.js';
import { useSelector, useDispatch } from 'react-redux'


function Unlock(props) {
  const principals = useSelector(state => state.principals)
  const currentPrincipal = useSelector(state => state.currentPrincipal)
  const identity = useSelector(state => (state.principals.length ? state.principals[currentPrincipal].identity : {}))
  const [open, setOpen] = React.useState(true);
  const [changeDialog, setChangeDialog] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch()
  
  const error = (e) => {
    props.alert("There was an error", e);
  }
  const clear = () => {
    props.confirm("Please confirm", "You are about to clear your wallet, which will remove all data from this device. Are you sure you want to continue?").then(v => {
      if (v) {
        setOpen(false);
        props.remove();
      }
    });
  };
  
  const iiLogin = () => {
    props.loader(true);
    setOpen(false);
    StoicIdentity.unlock(identity).then(r => {
      props.login();
    }).catch(e => {
    }).finally(() => {
      setTimeout(() => {
        setOpen(true)
        props.loader(false)
      }, 2000);
    });
  };

  return (
    <>
      {identity.type === 'ii' ?
        <button className="button-85" onClick={iiLogin}>Unlock</button>
        : ""}
    </>
  );
}

export default Unlock;
