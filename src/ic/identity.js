/* global BigInt */
import { AuthClient } from "@dfinity/auth-client";
// import { Secp256k1KeyIdentity } from "./secp256k1.js";
import { 
  mnemonicToId, 
  validatePrincipal, 
  encrypt, 
  decrypt, 
  fromHexString, 
  bip39 } from "./utils.js";

var identities = {};

const processId = (id, type) => {
  var p = id.getPrincipal().toString();
  identities[p] = id;
  return {
    principal : p,
    type : type
  }
}
const isLoaded = (p) => {
  return (identities.hasOwnProperty(p));
};

const StoicIdentity = {
  getIdentity : (principal) => {
    if (!identities.hasOwnProperty(principal)) return false;
    return identities[principal];
  },
  setup : (type, optdata) => {
    return new Promise(async (resolve, reject) => {
      var id;
      switch(type){
        case "ii":
          var auth = await AuthClient.create();
          auth.login({
            maxTimeToLive : BigInt(24*60*60*1000000000),
            identityProvider: "https://identity.ic0.app/",
            onSuccess: async () => {
              id = await auth.getIdentity()
              return resolve(processId(id, type));
            },
            onError : reject
          });
          return;
        default: break;
      }
      return reject("Cannot setup, invalid type: " + type);
    });
  },
  load : (_id) => {
    return new Promise(async (resolve, reject) => {
      var id;
      switch(_id.type){
        case "ii":
          var auth = await AuthClient.create();
          id = await auth.getIdentity();
          if (id.getPrincipal().toString() === '2vxsx-fae') return reject("Not logged in");
          if (id.getPrincipal().toString() !== _id.principal) return reject("Logged in using the incorrect user: " + id.getPrincipal().toString() + " but expecting " + _id.principal);
          return resolve(processId(id, _id.type));  
        default: break;
      }
      return reject();
    });
  },
  unlock : (_id, optdata) => {
    return new Promise(async (resolve, reject) => {
      StoicIdentity.load(_id).then(resolve).catch(async e => {
        var id;
        switch(_id.type) {
          case "ii":
            var auth = await AuthClient.create();
            auth.login({
              maxTimeToLive : BigInt(24*60*60*1000000000),
              identityProvider: "https://identity.ic0.app/",
              onSuccess: async () => {
                id = await auth.getIdentity()
                if (id.getPrincipal().toString() === '2vxsx-fae') return reject("Not logged in");
                if (id.getPrincipal().toString() !== _id.principal) return reject("Logged in using the incorrect user: " + id.getPrincipal().toString() + " but expecting " + _id.principal);
                return resolve(processId(id, _id.type));
              },
              onError : reject
            });
            return;
          default: break;
        }
      });
    });
  },
  lock : (_id) => {
    return new Promise(async (resolve, reject) => {
      switch(_id.type){
        case "ii":
            var auth = await AuthClient.create();
            auth.logout();
          break;
        case "private":
            localStorage.removeItem("_m");
          break;
        case "pem":
            localStorage.removeItem("_pem");
          break;
        default: break;
      }
      delete identities[_id.principal];
      return resolve(true);
    });
  },
  clear : (_id) => {
    return new Promise(async (resolve, reject) => {
      switch(_id.type){
        case "ii":
            var auth = await AuthClient.create();
            auth.logout();
          break;
        default: break;
      }
      delete identities[_id.principal];
      return resolve(true);
    });
  },
  change : (_id, type, optdata) => {
    return new Promise(async (resolve, reject) => {
      switch(_id.type){
        case "ii":
            var auth = await AuthClient.create();
            auth.logout();
          break;
        default: break;
      }
      //setup new
      delete identities[_id.principal];
      StoicIdentity.setup(type, optdata).then(resolve).catch(reject);
    });
  },
  validatePrincipal : validatePrincipal,
  validatePassword : (p) => {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return re.test(p);
  }
}
export {StoicIdentity};
window.StoicIdentity = StoicIdentity;