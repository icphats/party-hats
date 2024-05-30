import { createStore } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {principalToAccountIdentifier, LEDGER_CANISTER_ID} from './ic/utils';
const DBVERSION = 2;

var appData = {
  principals : [],
  addresses : [],
  currentPrincipal : 0,
  currentAccount : 0,
  currentToken : 0,
};

function initDb(_db){
  var db = _db ?? localStorage.getItem('_db');
  if (db){
    db = JSON.parse(db);
    // //db versioning
    // var savenow = false;
    // if (!Array.isArray(db)) {
    //   db = [[db],[]];
    //   console.log("Converting old DB to new");
    //   savenow = true;
    // }
    // if (db.length === 2) {
    //   db.push([0,0,0]);
    //   console.log("Converting old DB to new");
    //   savenow = true;
    // }
    // if (db.length === 3) {
    //   db.push(DBVERSION);
    //   console.log("Converting old DB to new");
    //   savenow = true;
    // }
    // let dbCurrentVersion = db[3];
    // if (dbCurrentVersion < 2) {
    //   //This DB upgrade adds nftgeek NFT support
    //   db[3] = 2;
    //   db[0] = db[0].map(({accounts, ...principalRest}) => ({
    //     ...principalRest,
    //     accounts: accounts.map(([accountName, tokens]) => ([
    //       accountName, // Preserve the accountName
    //       [] // Update tokens
    //       // The nfts element is omitted, effectively removing it from the structure
    //     ]))
    //   }));
    //   savenow = true;
    // }
    var loadedPrincipals = [];
    appData = {
      principals : [],
      addresses : [],
      currentPrincipal : 0,
      currentAccount : 0,
      currentToken : 0,
    };
    db[0].forEach(principal => {
      if (loadedPrincipals.indexOf(principal.identity.principal) >= 0) return false;
      loadedPrincipals.push(principal.identity.principal);
      var _principal = {
        accounts : [],
        neurons : [],
        apps : [],
        identity : principal.identity
      };
      principal.accounts.forEach((account, subaccount) => {
        // savenow = true;
        //if (subaccount >= 2) return;
        _principal.accounts.push({
          name : account[0],
          address : principalToAccountIdentifier(principal.identity.principal, subaccount),
          tokens : [
            {
              id : LEDGER_CANISTER_ID,
              name : "Internet Computer",
              symbol : "ICP",
              standard : 'ledger',
              fee: 10000,
              type: "fungible",
              decimals : 8,
            }, 
            ...account[1].reduce((acc, current) => {
              if (!acc.some(token => token.id === current.id)) {
                  acc.push(current);
              }
              return acc;
            }, [])
          ]
        });    
        return true;
      });
      if (!principal.hasOwnProperty('apps')) principal.apps = [];
      principal.apps.map(app => {
        _principal.apps.push(app);
        return true;
      });
      /* Do we need to store neruons?
      if (!principal.hasOwnProperty('neurons')) principal.neurons = [];
      principal.neurons.map(neuronId => {
        _principal.neurons.push({
          id : neuronId,
          data : false
        });
      });*/
      appData.principals.push(_principal);
      return true;
    });
    let cp = db[2][0] ?? 0;
    if (cp >= appData.principals.length) cp = 0;
    appData.currentPrincipal = cp;
    let ca = db[2][1] ?? 0;
    if (ca >= appData.principals[cp].accounts.length) ca = 0;
    appData.currentAccount = ca;
    let ct = db[2][2] ?? 0;
    if (ct >= appData.principals[cp].accounts[ca].tokens.length) ct = 0;
    appData.currentToken = ct;
    appData.addresses = db[1];
    
    // if (savenow) 
    saveDb(appData);
    return appData;
  } else {
    return {
      principals : [],
      addresses : [],
      currentPrincipal : 0,
      currentAccount : 0,
      currentToken : 0,
      freshInstall : true,
    };
  }
}
function newDb(identity){
  var tc = [[
    {
      accounts : [
        ["Main", 
          [], []
        ]
      ],
      identity : identity,
      neurons : [],
      apps : []
    }
  ],[],[0,0,0], DBVERSION];
  localStorage.setItem('_db', JSON.stringify(tc));
  return initDb();
}
function clearDb(){
  localStorage.removeItem('_db');
  var clearState = {
    principals : [],
    addresses : [],
    currentPrincipal : 0,
    currentAccount : 0,
    currentToken : 0,
  };
  appData = clearState;
  return clearState;
}
function saveDb(newState){
  var updatedDb = [[], newState.addresses, [newState.currentPrincipal, newState.currentAccount, newState.currentToken], DBVERSION];
  var loadedPrincipals = [];
  newState.principals.forEach(principal => {
    if (loadedPrincipals.indexOf(principal.identity.principal) >= 0) return false;
    loadedPrincipals.push(principal.identity.principal);
    var _p = {
      accounts : [],
      neurons : [],
      apps : [],
      identity : principal.identity
    };
    principal.accounts.forEach(account => {
      var _a = [account.name, []];
      account.tokens.map((b, i) => {
        if (i === 0) return false;
        _a[1].push(b);
        return true;      
      });
      _p.accounts.push(_a);
      return true;
    });
    principal.apps.forEach(app => {
      _p.apps.push(app);
      return true;
    });
    /* Do we need to store?
    principal.neurons.map(neuron => {
      _p.neurons.push(neuron.id);
    });*/
    updatedDb[0].push(_p);
    return true;
  });
  localStorage.setItem('_db', JSON.stringify(updatedDb));
  appData = newState;
  return newState;
}
function rootReducer(state = initDb(), action) {
  switch(action.type){
    case "refresh":
      console.log("Detected storage update");
      return initDb(action.payload);
    case "app/edit":
      return saveDb({
        ...state,
        principals : state.principals.map((principal,i) => {
          if (i === state.currentPrincipal) {
            return {
              ...principal,
              apps : principal.apps.map((app) => {
                if (app.host === action.payload.app.host) {
                  return {
                    ...app,
                    apikey : action.payload.app.apikey
                  }
                } else {
                  return app;
                }
              }),
            }
          } else {
            return principal;
          }
        }),
      });
    case "removewallet":
      return clearDb();
    case "createwallet":
      return newDb(action.payload.identity);
    case "deletewallet":
      return saveDb({
        ...state,
        currentPrincipal : (state.currentPrincipal > action.payload.index ? state.currentPrincipal - 1 : state.currentPrincipal),
        principals : state.principals.filter((e,i) => i !== action.payload.index)
      });
    case "deleteToken":
      return saveDb({
        ...state,
        principals : state.principals.map((principal,i) => {
          if (i === state.currentPrincipal) {
            return {
              ...principal,
              accounts : principal.accounts.map((account,ii) => {
                if (ii === state.currentAccount) {
                  return {
                    ...account,
                    tokens : account.tokens.filter((e, i) => (e && i !== state.currentToken)),
                  }
                } else {
                  return account;
                }
              }),
            }
          } else {
            return principal;
          }
        }),
        currentToken : state.currentToken-1
      });
    case "addwallet": //TODO
      if (state.principals.some(e => e.identity.principal === action.payload.identity.principal)) return state;
      var cp = state.principals.length;
      return saveDb({
        ...state,
        principals : [
          ...state.principals,
          {
            accounts : [
              {
                name : "Main",
                address : principalToAccountIdentifier(action.payload.identity.principal, 0),
                tokens : [
                  {
                    id : LEDGER_CANISTER_ID,
                    name : "Internet Computer",
                    symbol : "ICP",
                    standard : 'ledger',
                    decimals : 8,
                    fee: 10000,
                    type : 'fungible',
                  }
                ],
              }
            ],
            identity : action.payload.identity,
            neurons : [],
            apps : [],
          },
        ],
        currentPrincipal : cp
      });
    case "currentPrincipal":
      return saveDb({
        ...state,
        currentToken : 0,
        currentAccount : 0,
        currentPrincipal : action.payload.index
      });
    case "currentAccount":
      return saveDb({
        ...state,
        currentToken : 0,
        currentAccount : action.payload.index
      });
    case "currentToken":
      return saveDb({
        ...state,
        currentToken : action.payload.index ?? 0
      });
    case "account/edit":
      return saveDb({
        ...state,
        principals : state.principals.map((principal,i) => {
          if (i === state.currentPrincipal) {
            return {
              ...principal,
              accounts : principal.accounts.map((account,ii) => {
                if (ii === state.currentAccount) {
                  return {
                    ...account,
                    name : action.payload.name
                  }
                } else {
                  return account;
                }
              }),
            }
          } else {
            return principal;
          }
        }),
      });
    case "account/add":
      return saveDb({
        ...state,
        principals : state.principals.map((principal,i) => {
          if (i === state.currentPrincipal) {
            return {
              ...principal,
              accounts : [...principal.accounts, {
                name : "Account " + action.payload.id,
                address : principalToAccountIdentifier(action.payload.principal, action.payload.id),
                tokens : [{
                  id : LEDGER_CANISTER_ID,
                  standard : "ledger",
                  name : "Internet Computer",
                  symbol : "ICP",
                  fee: 10000,
                  type: "fungible",
                  decimals : 8,
                }],
              }]
            }
          } else {
            return principal;
          }
        }),
      });
    case "account/token/add":
      if (state.principals[state.currentPrincipal].accounts[state.currentAccount].tokens.some(e => e.id === action.payload.metadata.id)) return state;
      return saveDb({
        ...state,
        principals : state.principals.map((principal,i) => {
          if (i === state.currentPrincipal) {
            return {
              ...principal,
              accounts : principal.accounts.map((account,ii) => {
                if (ii === state.currentAccount) {
                  return {
                    ...account,
                    tokens : [...account.tokens, action.payload.metadata]
                  }
                } else {
                  return account;
                }
              }),
            }
          } else {
            return principal;
          }
        }),
      });
    
    case "addresses/add":
      return saveDb({
        ...state,
        addresses: [...state.addresses, action.payload]
      });
    case "addresses/edit": 
      return saveDb({
        ...state,
        addresses:  state.addresses.map((address,i) => {
          if (i === action.payload.index) {
            return {
              name : action.payload.name,
              address : action.payload.address,
            }
          } else {
            return address;
          }
        })
      });
    case "addresses/delete":
      return saveDb({
        ...state,
        addresses : state.addresses.filter((e,i) => i !== action.payload)
      });
    default: break;
  }
  return state;
};

const store = configureStore({
    reducer: rootReducer
});

window.addEventListener('storage', (e) => {
  if (e.key === "_db" && e.url !== "https://www.stoicwallet.com/?stoicTunnel") {
    store.dispatch({
      type: "refresh",
      payload : e.newValue
    });
  }
});
export default store;