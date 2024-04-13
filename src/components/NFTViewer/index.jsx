import { useEffect, useState, useRef, useContext } from "react";

import "./index.css"
import Stats from "../Stats/index.jsx";
import NftItem from "./NFTItem.jsx";
import layer_assets from "../../utils/const.jsx";

import { LayerContext } from "./LayerContext";
import { useMyContext } from "../../context/MyContext.jsx";


import gridview_icon from "../../assets/grid-view-icon.png";
import filter_icon from "../../assets/filter-icon.png";
import FilterView from "./FilterViewer.jsx";
import nftStatic from "../../json/nft_static.json"
import logo from "../../assets/1000x1000.png"


function NFT_Grid({setIsPasswordCorrect}) {
  
  const [truth, setTruth] = useState([])

  const [viewMode, setViewMode] = useState(2);
  const [mobileFilter, setMobileFilter] = useState(0);
  const [count, setCount] = useState(0);
  const containerRef = useRef(null);
  const [layer, setLayer] = useState([]);
  const [partialTruth, setPartialTruth] = useState([])
  const [searchIndex, setSearchIndex] = useState(0)
  const [priceViewToggle, setPriceViewToggle] = useState(0)
  const [priceSymbol, setPriceSymbol] = useState("$")
  const { listings } = useMyContext();
  const [changer, setChanger] = useState(0)
  const LAYERSECTIONS = ["custom", "background", "border", "emble", "glow", "phat"];


  const {
    backgroundLayer,
    borderLayer,
    embleLayer,
    phatLayer,
    glowLayer,
    setBackgroundLayer,
    setBorderLayer,
    setEmbleLayer,
    setPhatLayer,
    setGlowLayer
  } = useContext(LayerContext);

  const handleViewMode = () => {
    setViewMode(viewMode === 1 ? 2 : 1);
    if (viewMode == 2) {
      if (count < 150) setCount(Math.min(150, truth.length));
    }
    if (viewMode == 1) {
      if (count < 70) setCount(Math.min(70, truth.length));
    }
  }

  const handleReset = () => {
    setBackgroundLayer([]);
    setBorderLayer([]);
    setEmbleLayer([]);
    setPhatLayer([]);
    setGlowLayer([]);
    setPriceViewToggle(-4);

    for(let i = 0; i < LAYERSECTIONS.length; i++){
      for(let j = 0; j < layer_assets[LAYERSECTIONS[i]].length; j++){
        let actualLayerName = layer_assets[LAYERSECTIONS[i]][j]
        let a = document.getElementById(actualLayerName)
        a.classList.remove("filter-active")
      }
    }

    updateShowData()
  }

  const pushOneItem = (i, layerData) => {
    let price = Number(listings[nftStatic[i][Object.keys(nftStatic[i])[0]].mint - 1][1].price);
    price = price ? price / 100000000 : false
    let bg = layerData[4];
    let mint = nftStatic[i][Object.keys(nftStatic[i])[0]].mint;
    let pid = Object.keys(nftStatic[i])[0]
    return{ pid, mint, bg, price };
  }

  const updateShowData = () => {
    const data = (() => {
      let content = [];
      if (listings && listings.length > 0) {
        for (let i = 0; i < nftStatic.length; i++) {
          let layerData = nftStatic[i][Object.keys(nftStatic[i])[0]].assetlayers;
          if (
              (embleLayer.length === 0 || embleLayer.includes(layerData[0])) &&
              (borderLayer.length === 0 || borderLayer.includes(layerData[1])) &&
              (phatLayer.length === 0 || phatLayer.includes(layerData[2])) &&
              (glowLayer.length === 0 || glowLayer.includes(layerData[3])) &&
              (backgroundLayer.length === 0 || backgroundLayer.includes(layerData[4]))
            )
            content.push(pushOneItem(i, layerData))
        }
      }
      return content;
    })();

    setPartialTruth(data);

    if(priceViewToggle > 0) {
      let n = changer + 1
      setChanger(n);
    } else {
      setTruth(data)
    }

    if (viewMode == 2) {
      if (count < 150) setCount(Math.min(150, data.length));
    }
    if (viewMode == 1) {
      if (count < 70) setCount(Math.min(70, data.length));
    }
  }

  

  useEffect(()=> {
    if (listings && listings.length > 0) {
      updateShowData();
    }
  },[listings])

  useEffect(() => {
    updateShowData();
  }, [backgroundLayer, borderLayer, embleLayer, phatLayer, glowLayer])

  useEffect(() => {

    const newData = partialTruth.filter((item) => {
      return item.price > 0;
    });

    switch(priceViewToggle){   
      case 0:
        console.log("sorted 0")
        setPriceSymbol("$")
        setTruth(partialTruth)
        break;
      case 1:
        console.log("sorted 1")
        setPriceSymbol("$")
        setTruth(newData);
        break;
      case 2:
        console.log("sorted 2")
        setPriceSymbol("↑")
        const sortedDataAsc = newData.sort((a, b) => {
          return a.price - b.price;
        });
        setTruth(sortedDataAsc);
        break;
      case 3:
        console.log("sorted 3")
        setPriceSymbol("↓")
        const sortedDataDesc = newData.sort((a, b) => {
          return b.price - a.price;
        });
        setTruth(sortedDataDesc);
        break;
      default:
        setPriceSymbol("$")
        break; 
    }
  }, [priceViewToggle, changer])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) { // Check if ESC key is pressed (keyCode 27)
        handleReset(); 
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);

    (async () => {
      try {
        const response = await fetch('./json/layers_static.json');
        const jsonData = await response.json();
        setLayer(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();

    

    updateShowData();
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleScroll = () => {
    const container = containerRef.current;

    if (
      container.scrollTop + container.clientHeight + 1 >= container.scrollHeight
    ) {
      setCount((count + 30) > truth.length ? truth.length : (count + 30));
      console.log("bottom reached");
    }

  }

  useEffect(() => {
    handleSearch(searchIndex)
  }, [searchIndex]);


  const handleSearch = (n) => {
    if (n > 0 && n <= 10000){
      let i = n - 1;
      let layerData = nftStatic[i][Object.keys(nftStatic[i])[0]].assetlayers;
      setTruth([pushOneItem(i, layerData)])
    }
  };

  return <>
    <div className="nft-viewer">
      <div className="state-control">
        <div className="logo-container">
          <img onClick={() => setIsPasswordCorrect(false)} src={logo} className="icphats-logo" alt="icphats logo" />
        </div>
        <div className="nft-count-container">
              <p>{truth.length}</p>
        </div>
        <div className="viewmodes">
            <a href="#" onClick={() => { setMobileFilter(1 - mobileFilter) }} className="filterIcon"><img src={filter_icon} alt="Filter View" width={26} /></a>
        </div>
        <Stats />
      </div>
      <div className="grid-filter-container">
        <div className={mobileFilter == 1 ? "mobile-filter-container" : "filter-container"}>
          <FilterView setSearchIndex={setSearchIndex} layer = {layer} handleReset={handleReset} handleViewMode={handleViewMode} setPriceViewToggle={setPriceViewToggle} priceViewToggle={priceViewToggle} priceSymbol={priceSymbol}/>
        </div>
        <div className={"grid-container"} >
          <div className={viewMode == 1 ? "nft-container" : "nft-container-card-version"} onScroll={handleScroll} ref={containerRef}>
            {truth
              .slice(0, count)
              .map((token, index) => {
                return <NftItem _viewMode={viewMode} index={index} bg={token.bg} price={token.price} pid={token.pid} mint={token.mint} />
              })}
          </div>
        </div>
      </div>

    </div>
  </>
}

export default NFT_Grid;


