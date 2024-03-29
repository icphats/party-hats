import React, { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import Landing from "./pages/landing";
//import splash from "../assets/splash.png"
import "./App.css";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
import logo from "./assets/logo_1000x1000.png"


function App() {
  
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const handleButtonClick = () => {
    setShowPasswordInput(true);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    if (password === 'icphats') {
      setIsPasswordCorrect(true);
      setShowPasswordInput(false); // Optionally hide the input again
    }
  };



  if (!isPasswordCorrect) return <div className="loading-container">
    <div className="loading-inner-content-container">
      {!showPasswordInput &&
        (<>
          <img onClick={handleButtonClick} className="loading-logo" src={logo} alt="" />
          <p className="loading-text">Built on the Internet Computer</p>
        </>)}

      {showPasswordInput &&
        (<input
          type="password"
          placeholder="Enter Password"
          className="password-input-box"
          onChange={handlePasswordChange}
        />)
      }
    </div>
  </div>;

  return (
    <div className="content">
      <Landing />
    </div>
  );
}

export default App;