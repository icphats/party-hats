import React, { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import WebApp from "./pages/webapp";
import Connect from "./containers/Connect";
import "./App.css";

function App() {
  return (
    <div className="content">
      <WebApp/>
    </div>
  );
}
export default App;