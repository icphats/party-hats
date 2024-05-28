import React from 'react';
import './index.css'
import logo from '../../assets/ICP.png'
export default function ConnectList(props) {
  const handleClick = (t) => {
    props.handler(t);
  };
  return (
    <div>
      <button className="button-85" onClick={() => handleClick('link') }>
          <img src={logo} alt="" />
      </button>
    </div>
  );
}