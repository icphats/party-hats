import { Buffer } from 'buffer/'
globalThis.Buffer = Buffer

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { MyProvider } from './context/NftContext.jsx'
import { AccountProvider } from './context/AccountContext.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AccountProvider>
        <MyProvider>
          <App />
        </MyProvider>
      </AccountProvider>
    </Provider>
  </React.StrictMode>
)
