import React from 'react';
import { PiOptionBold } from "react-icons/pi";

function NftOptions(props) {
  
  return (
    <>
        <button onClick={props.sendNft} className="send-now-container">
            <PiOptionBold/>
        </button>
    </>
  );
}

export default NftOptions;
