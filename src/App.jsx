import React, { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import WebApp from "./views/webapp";
import "./App.css";

function App() {
  return (
    <div className="content">
      <WebApp/>
    </div>
  );
}
export default App;