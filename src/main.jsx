import { Buffer } from "buffer/";
globalThis.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AccountProvider } from "./context/AccountContext.jsx";
import { Provider } from "react-redux";
import store from "./store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AccountProvider>
        <App />
      </AccountProvider>
    </Provider>
  </React.StrictMode>
);
