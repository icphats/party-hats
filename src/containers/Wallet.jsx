import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AiFillLock } from 'react-icons/ai';

function Wallet(props) {

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const account = useSelector(state => (state.principals.length ? state.principals[0].accounts[0] : []))
  const principal = useSelector(state => (state.principals.length ? state.principals[0].identity.principal : []))

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatAddress = (address, startLength = 5, endLength = 3) => {
    if (address.length <= startLength + endLength) {
      return address;
    }
    const start = address.slice(0, startLength);
    const end = address.slice(-endLength);
    return `${start}...${end}`;
  };
  
  const handleDrawerClose = () => {
    setMobileOpen(false);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const lockWallet = () => {
    props.logout();
  };
  const clearWallet = () => {
    props.remove();
  };

  return (
    <>
      <div className="profile-row">
      <img width="30px" height="30px" src="src/assets/1000x1000.png" alt="" />
      <div 
        className='copiable-text'
        onClick={() => copyToClipboard(principal)}
      >
          {formatAddress(principal)}
      </div>
      <AiFillLock onClick={lockWallet}/>
    </div>
    </>
  );
}

export default Wallet;
