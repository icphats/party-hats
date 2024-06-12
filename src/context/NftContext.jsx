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
  const [viewMode, setViewMode] = useState(1);
  const [area, setArea] = useState(0);
  const [increment, setIncrement] = useState(0); // Number of items to load on each increment
  const [count, setCount] = useState(10); //this is the count used in the beginning and for resets.
  const [shownCount, setShownCount] = useState(100); //this is the count that accumulates as user scrolls in window.
  const [searchIndex, setSearchIndex] = useState("");

  //Reset
  const [resetToggle, setResetToggle] = useState(false);

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
      //When priceViewToggle > 1, it also orders by price.
      setNriViewToggle(0); //we need to make sure there is no other ordering.
      orderNftArray(filteredArray, "price");
    }
  }, [priceViewToggle]);

  useEffect(() => {
    //when priceViewToggle > 1, it means that price is being used for ordering. When priceViewToggle = 1, it's active filtering, 2 & 3 also filters, therefore > 1.
    if (priceViewToggle > 1) {
      setPriceViewToggle(0);
    } else {
      orderNftArray(filteredArray, "nri");
    }
  }, [nriViewToggle]);

  useEffect(() => {
    setFilteredArray(nftArray);
  }, [resetToggle]);

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

  useEffect(() => {
    const element = document.querySelector(".grid-container");
    if (element) {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const calculatedArea = width * height;
      setArea(calculatedArea);
    }
  }, []);

  useEffect(() => {
    let tempCount = 0;
    tempCount = Math.ceil(area / 4000);
    setCount(tempCount);
    setShownCount(tempCount);
    setIncrement(tempCount);
  }, [area]);

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
        shownCount,
        setShownCount,
        increment,
        resetToggle,
        setResetToggle,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};
