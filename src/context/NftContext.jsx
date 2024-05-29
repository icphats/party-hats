import React, { createContext, useContext, useState } from "react";
import ic from "../utils/blast";
import { idlFactory as nftidl } from "../utils/idl/nftCanister.idl";
import staticNftArray from "../utils/json/newStructureWithPrice.json";

const phatCanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
const NftContext = createContext();

export const useNftContext = () => useContext(NftContext);

export const NftContextProvider = ({ children }) => {
  const [nftArray, setNftArray] = useState([]);
  const [liveStatsNew, setLiveStatsNew] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // For Filtering
  const [filteredArray, setFilteredArray] = useState([]);
  const [priceViewToggle, setPriceViewToggle] = useState(0);
  const [nriViewToggle, setNriViewToggle] = useState(0);
  const [userPhatToggle, setUserPhatToggle] = useState(0);

  // For View
  const [viewMode, setViewMode] = useState(2);
  const [count, setCount] = useState(300);
  const [searchIndex, setSearchIndex] = useState("");

  const loadInitialData = async () => {
    let nftCanister = await ic(phatCanister, nftidl);

    let newStatsResponse = await nftCanister.stats();
    let listingsResponse = await nftCanister.listings();
    let transactionsResponse = await nftCanister.transactions();

    //adds prices to main array
    listingsResponse.forEach((item) => {
      let index = item[0];
      let price = Number(item[1].price);
      staticNftArray[index].price = price;
    });

    setNftArray(staticNftArray);
    setLiveStatsNew(newStatsResponse);
    setTransactions(transactionsResponse);
    setFilteredArray(staticNftArray);

    setLoaded(true);
  };

  const filterNftArray = async () => {
    setFilteredArray(nftArray);
  };

  React.useEffect(() => {
    loadInitialData();
    // filterNftArray();
  }, []);

  return (
    <NftContext.Provider
      value={{
        loaded,
        nftArray,
        liveStatsNew,
        transactions,
        filteredArray,
        priceViewToggle,
        setPriceViewToggle,
        nriViewToggle,
        setNriViewToggle,
        userPhatToggle,
        setUserPhatToggle,
        viewMode,
        setViewMode,
        count,
        setCount,
        searchIndex,
        setSearchIndex,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};
