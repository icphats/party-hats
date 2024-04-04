import React, { createContext, useContext, useState } from 'react';
import extjs from '../ic/extjs';

const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";


const MyContext = createContext();

export const useMyContext = () => useContext(MyContext);

export const MyProvider = ({ children }) => {
    const [listings, setListings] = useState([]);
    const [liveStats, setLiveStats] = useState([]);

    const loadInitialData = async () => {

        let listings = await api.token(partyhatscanister).listings();
        let statsResponse = await api.token(partyhatscanister).stats();

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
