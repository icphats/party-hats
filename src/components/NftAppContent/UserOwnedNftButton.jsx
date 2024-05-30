import React from "react";
import { PiOptionBold } from "react-icons/pi";

function UserOwnedNftButton(props) {
  return (
    <>
      <button onClick={props.sendNft} className="send-now-container">
        <PiOptionBold />
      </button>
    </>
  );
}

export default UserOwnedNftButton;
