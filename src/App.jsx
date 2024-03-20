import { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import Landing from "./pages/landing";
//import splash from "../assets/splash.png"
import "./App.css";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";



function App() {

  // if (!loaded) return <div className="loading-container">
  //   <div className="loading-inner-content-container">
  //     <img className="loading-logo" src={logo} alt="" />
  //     <p className="loading-text df-font">Built on the Internet Computer</p>
  //   </div>
  // </div>;

  return (
    <div className="content">
      <Landing />
    </div>
  );
}

export default App;
