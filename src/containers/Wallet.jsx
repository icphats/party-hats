import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AiFillLock } from "react-icons/ai";
import logo from "../assets/1000x1000.png";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import { useNftContext } from "../context/NftContext";
import { useAccountContext } from "../context/AccountContext";

function Wallet(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { liveStatsNew, userPhatToggle, setUserPhatToggle } = useNftContext();
  const { appState, userPhats } = useAccountContext();
  const [floorPrice, setFloorPrice] = useState(0);

  const principal = useSelector((state) =>
    state.principals.length ? state.principals[0].identity.principal : []
  );

  const handleUserPhatToggle = () => {
    setUserPhatToggle((prev) => (prev + 1) % 2);
  };

  useEffect(() => {
    setFloorPrice(liveStatsNew[3]);
  }, [liveStatsNew]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
        <img width="20px" height="20px" src={logo} alt="" />
        <div
          className="copiable-text"
          wi
          onClick={() => copyToClipboard(principal)}
        >
          {formatAddress(principal)}
        </div>
        <AiFillLock onClick={lockWallet} />
      </div>
      <div className="treasure-chest-container">{`${
        (userPhats.length * Number(floorPrice)) / 100000000
      } `}</div>
      {appState > 1 ? (
        <>
          <div className="widgets-grid">
            <button
              className="button-01"
              onClick={handleUserPhatToggle}
            ></button>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Wallet;
