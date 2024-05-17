import React, { createContext, useContext, useState } from 'react';
import ic from '../utils/blast';
import { idlFactory as nftidl } from '../utils/idl/nftCanister.idl';
import staticNftArray from '../utils/json/newStructureWithPrice.json';

const phatCanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
const NftContext = createContext();

export const useNftContext = () => useContext(NftContext);

export const MyProvider = ({ children }) => {
    const [nftArray, setNftArray] = useState([]);
    const [liveStatsNew, setLiveStatsNew] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [liveListings, setLiveListings] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const loadInitialData = async () => {

        let nftCanister = await ic(phatCanister, nftidl);
        
        let newStatsResponse = await nftCanister.stats();
        let listingsResponse = await nftCanister.listings();
        let transactionsResponse = await nftCanister.transactions();

        //adds prices to main array
        listingsResponse.forEach(item => {
            let index = item[0];
            let price = Number(item[1].price);
            staticNftArray[index].price = price;
        });


        setNftArray(staticNftArray);
        setLiveStatsNew(newStatsResponse);
        setLiveListings(listingsResponse)
        setTransactions(transactionsResponse);

        setLoaded(true);
    };

    React.useEffect(() => {
        loadInitialData();
    }, []);

    return (
        <NftContext.Provider 
        value={{
            loaded,
            nftArray,
            liveStatsNew,
            transactions,
            liveListings 
        }}>
            {children}
        </NftContext.Provider>
    );
};
