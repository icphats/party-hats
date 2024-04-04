import { useEffect, useState, useRef, useContext } from "react";

import "./index.css"
import Stats from "../Stats/index.jsx";
import NftItem from "./NFTItem.jsx";

import { LayerContext } from "./LayerContext";
import { useMyContext } from "../../context/MyContext.jsx";


import gridview_icon from "../../assets/grid-view-icon.png";
import filter_icon from "../../assets/filter-icon.png";
import FilterView from "./FilterViewer.jsx";
import nftStatic from "../../json/nft_static.json"
import logo from "../../assets/1000x1000.png"


function NFT_Grid({setIsPasswordCorrect}) {
  const [viewMode, setViewMode] = useState(2);
  const [mobileFilter, setMobileFilter] = useState(0);
  const [filterMode, setFilterMode] = useState(1);
  const [count, setCount] = useState(0);
  const itemsPerPage = 10000;
  const containerRef = useRef(null);
  const [layer, setLayer] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0)

  const { listings } = useMyContext();
  
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
      if (count < 150) setCount(Math.min(150, filteredData.length));
    }
    if (viewMode == 1) {
      if (count < 70) setCount(Math.min(70, filteredData.length));
    }
  }

  const handleReset = () => {
    setBackgroundLayer([]);
    setBorderLayer([]);
    setEmbleLayer([]);
    setPhatLayer([]);
    setGlowLayer([]);
  }

  const updateShowData = () => {
    const data = (() => {
      let content = [];
      for (let i = 0; i < nftStatic.length; i++) {
        const layerData = nftStatic[i][Object.keys(nftStatic[i])[0]].assetlayers;
        if ((embleLayer.length==0 || embleLayer.includes(layerData[0].toString())) &&
          (borderLayer.length==0 || borderLayer.includes(layerData[1].toString())) &&
          (phatLayer.length==0 || phatLayer.includes(layerData[2].toString())) &&
          (glowLayer.length==0 || glowLayer.includes(layerData[3].toString())) &&
          (backgroundLayer.length==0 || backgroundLayer.includes(layerData[4].toString())))
            content.push({
              id: Object.keys(nftStatic[i])[0],
              mint: nftStatic[i][Object.keys(nftStatic[i])[0]].mint,
              bg: layerData[4],
              price: listings[nftStatic[i][Object.keys(nftStatic[i])[0]].mint - 1] ?
                listings[nftStatic[i][Object.keys(nftStatic[i])[0]].mint - 1] : false
            });
      }
      return content;
    })();
    setFilteredData(data);
    if (viewMode == 2) {
      if (count < 150) setCount(Math.min(150, data.length));
    }
    if (viewMode == 1) {
      if (count < 70) setCount(Math.min(70, data.length));
    }
  }

  useEffect(() => {
    updateShowData();
  }, [backgroundLayer, borderLayer, embleLayer, phatLayer, glowLayer])

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

    (async () => {
      try {
        const response = await fetch('./json/nft_static.json');
        const jsonData = await response.json();
        setNfts(jsonData);
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


  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const handleScroll = () => {
    const container = containerRef.current;

    if (
      container.scrollTop + container.clientHeight + 1 >= container.scrollHeight
    ) {
      setCount((count + 30) > filteredData.length ? filteredData.length : (count + 30));
      console.log("bottom reached");
    }

  }

  useEffect(() => {
    handleSearch(searchIndex)
  }, [searchIndex]);

  const handleSearch = (n) => {
    let i;
    if (n > 0 && n <= 10000){
      i = n - 1
      setFilteredData([{
        id: Object.keys(nftStatic[i])[0],
        mint: nftStatic[i][Object.keys(nftStatic[i])[0]].mint,
        bg: nftStatic[i][Object.keys(nftStatic[i])[0]].assetlayers,
        price: listings[nftStatic[i][Object.keys(nftStatic[i])[0]].mint - 1] ?
          listings[nftStatic[i][Object.keys(nftStatic[i])[0]].mint - 1] : false
      }]);
    }

  };

  return <>
    <div className="nft-viewer">
      <div className="state-control">
        <div className="logo-container">
          <img onClick={() => setIsPasswordCorrect(false)} src={logo} className="icphats-logo" alt="icphats logo" />
        </div>
        <div className="nft-count-container">
              <p>{filteredData.length}</p>
        </div>
        <div className="viewmodes">
            <a href="#" onClick={() => { handleReset() }} ><div className="escape-icon">ESC</div></a>
              <a href="#" onClick={() => { handleViewMode() }}><img src={gridview_icon} alt="Card View" width={20} /></a>
              {/* <a href="#" onClick={() => { priceViewToggle() }}><div className="price-view-icon"><p>$</p></div></a> */}
              <a href="#" onClick={() => { setMobileFilter(1 - mobileFilter) }} className="filterIcon"><img src={filter_icon} alt="Filter View" width={20} /></a>
              {/* <a href="#" onClick={() => { setViewMode(1) }} style={{ border: (viewMode == 1 ? "1px solid white" : "0px") }}><img src={cardview_icon} alt="Image View" width={20} /></a> &nbsp; */}
        </div>
        <Stats />
      </div>
      <div className="grid-filter-container">
        <div className={mobileFilter == 1 ? "mobile-filter-container" : "filter-container"}>
          <FilterView setSearchIndex={setSearchIndex} layer = {layer} filterMode = {filterMode}/>
        </div>
        <div className={"grid-container"} >
          <div className={viewMode == 1 ? "nft-container" : "nft-container-card-version"} onScroll={handleScroll} ref={containerRef}>
            {filteredData
              .slice(0, count)
              .map((token, index) => {
                return <NftItem _viewMode={viewMode} index={index} tokens={filteredData.slice(0, count)} bg={token.bg} price={token.price} pid={token.id} />
              })}
          </div>
        </div>
      </div>

    </div>
  </>
}

export default NFT_Grid;


