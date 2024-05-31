import React, { createContext, useContext, useState, useEffect } from "react";
import ic from "../utils/blast";
import { idlFactory as nftidl } from "../utils/idl/nftCanister.idl";
import staticNftArray from "../utils/json/newStructureWithPrice.json";
import { useLayerContext } from "./LayerContext";
import { useAccountContext } from "./AccountContext";

const phatCanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
const NftContext = createContext();

export const useNftContext = () => useContext(NftContext);

export const NftContextProvider = ({ children }) => {
  const { userPhats } = useAccountContext();
  const { backgroundLayer, borderLayer, emblemLayer, phatLayer, glowLayer } =
    useLayerContext();
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
  const [mobileFilter, setMobileFilter] = useState(0);
  const [viewMode, setViewMode] = useState(2);
  const [count, setCount] = useState(10);
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

  useEffect(() => {
    loadInitialData();
  }, []);

  const filterNftArray = async (a) => {
    if (priceViewToggle) {
      a = a.filter((el) => el.price);
    }

    let newFilteredArray = a.reduce((acc, item) => {
      const layerData = item.assetlayers;
      if (
        (emblemLayer.length === 0 || emblemLayer.includes(layerData[0])) &&
        (borderLayer.length === 0 || borderLayer.includes(layerData[1])) &&
        (phatLayer.length === 0 || phatLayer.includes(layerData[2])) &&
        (glowLayer.length === 0 || glowLayer.includes(layerData[3])) &&
        (backgroundLayer.length === 0 || backgroundLayer.includes(layerData[4]))
      ) {
        acc.push(item);
      }
      return acc;
    }, []);

    setFilteredArray(newFilteredArray);
  };

  const orderNftArray = (a, type) => {
    switch (type) {
      case "price":
        switch (priceViewToggle) {
          case 0:
            a = [...a].sort((a, b) => a.mint - b.mint);
            setFilteredArray(a);
            break;
          case 2:
            a = [...a].sort((a, b) => a.price - b.price);
            setFilteredArray(a);
            break;
          case 3:
            a = [...a].sort((a, b) => b.price - a.price);
            setFilteredArray(a);
            break;
          default:
            break;
        }
        break;
      case "nri":
        switch (nriViewToggle) {
          case 0:
            a = [...a].sort((a, b) => a.mint - b.mint);
            setFilteredArray(a);
            break;
          case 1:
            a = [...a].sort((a, b) => a.nri - b.nri);
            setFilteredArray(a);
            break;
          case 2:
            a = [...a].sort((a, b) => b.nri - a.nri);
            setFilteredArray(a);
            break;
          default:
            break;
        }
        break;
    }
  };

  const showUserPhats = (userPhats) => {
    if (nftArray) {
      let a = nftArray.filter((i) => userPhats.includes(i.pid));
      setFilteredArray(a);
    }
  };

  useEffect(() => {
    userPhatToggle ? showUserPhats(userPhats) : setFilteredArray(nftArray);
  }, [userPhatToggle]);

  useEffect(() => {
    filterNftArray(nftArray);
  }, [backgroundLayer, borderLayer, emblemLayer, phatLayer, glowLayer]);

  useEffect(() => {
    filterNftArray(nftArray);
    if (priceViewToggle > 1) {
      //When priceViewToggle > 1, it also orders by
      setNriViewToggle(0); //we need to make sure there is no other ordering.
      orderNftArray(filteredArray, "price");
    }
  }, [priceViewToggle]);

  useEffect(() => {
    if (priceViewToggle > 1 && nriViewToggle > 0) setPriceViewToggle(0);
    orderNftArray(filteredArray, "nri");
  }, [nriViewToggle]);

  const searchFilter = (mint) => {
    if (mint > 0 && mint <= 10000) {
      let i = mint - 1;
      setFilteredArray([nftArray[i]]);
    } else {
      setFilteredArray(nftArray);
    }
  };

  useEffect(() => {
    searchFilter(searchIndex);
  }, [searchIndex]);

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
        mobileFilter,
        setMobileFilter,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};
