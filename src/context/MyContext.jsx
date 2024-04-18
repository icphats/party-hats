import React, { createContext, useContext, useState } from 'react';
import extjs from '../ic/extjs';
import nftStatic from "../json/nft_static.json"


const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

let phatApi = api.token(partyhatscanister)
// let phatId = "1";
// let phatToken = phatApi.decodeTokenId(phatId)
// console.log(phatToken)
// console.log("phats details",phatDetails.ok)


const MyContext = createContext();

export const useMyContext = () => useContext(MyContext);

export const MyProvider = ({ children }) => {
    const [listings, setListings] = useState([]);
    const [liveStats, setLiveStats] = useState([]);
    const [accountIds, setAccountIds] = useState([])

    const loadInitialData = async () => {

        let listings = await api.token(partyhatscanister).listings();
        let statsResponse = await api.token(partyhatscanister).stats();
        
        // for (let i = 0; i < nftStatic.length; i++) {
        //     let phatDetails = await phatApi.getDetails(nftStatic[i][0])
        //     console.log(phatDetails)
        // }

        setListings(listings);
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
