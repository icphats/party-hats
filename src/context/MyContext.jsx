import React, { createContext, useContext, useState } from 'react';
import extjs from '../ic/extjs';
import ic from '../utils/blast';
import { idlFactory as nftidl } from '../ic/nft-canister.idl';


const api = extjs.connect("https://icp0.io/");
const phatCanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
const MyContext = createContext();

export const useMyContext = () => useContext(MyContext);

export const MyProvider = ({ children }) => {
    const [listings, setListings] = useState([]);
    const [liveStats, setLiveStats] = useState([]);

    const loadInitialData = async () => {

        let nftCanister = await ic(phatCanister, nftidl);
        let data = await nftCanister.listings();

        let listingsResponse = await api.token(phatCanister).listings();
        let statsResponse = await api.token(phatCanister).stats();

        console.log(data);
        console.log(listingsResponse);
        console.log(statsResponse);

        setListings(listingsResponse);
        setLiveStats(statsResponse);
    };

    React.useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <MyContext.Provider 
        value={{ 
            listings, 
            liveStats 
        }}>
            {children}
        </MyContext.Provider>
    );
};
