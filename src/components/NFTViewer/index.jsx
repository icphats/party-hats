import { useEffect, useState, useRef, useContext } from "react";
import extjs from "../../ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

import "./index.css"
import Stats from "../Stats/index.jsx";

import { LayerContext } from "./LayerContext";
import cardview_icon from "../../assets/card-view-icon.png";
import gridview_icon from "../../assets/grid-view-icon.png";
import filter_icon from "../../assets/filter-icon.png";
import filter_icon_2 from "../../assets/filter-icon_2.png";
import FilterView from "./FilterViewer.jsx";
import nftStatic from "../../json/nft_static.json"
import logo from "../../assets/1000x1000.png"



function NFT_Grid({setIsPasswordCorrect}) {
  const [viewMode, setViewMode] = useState(2);
  const [mobileFilter, setMobileFilter] = useState(0);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMode, setFilterMode] = useState(1);
  const [index, setIndex] = useState(""); // State variable for index input\
  const [indexToken, setIndexToken] = useState("");
  const [count, setCount] = useState(0);
  const itemsPerPage = 10000;
  const containerRef = useRef(null);
  const [layer, setLayer] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
      console.log(embleLayer,borderLayer,phatLayer,glowLayer,backgroundLayer);
      for (let i = 0; i < nftStatic.length - 1; i++) {
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
      console.log(content);
      return content;
    })();
    console.log(data);
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
  }, [backgroundLayer, borderLayer, embleLayer, phatLayer, glowLayer, filterMode])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) { // Check if ESC key is pressed (keyCode 27)
        handleReset(); 
      }
    };

    // Add event listener when the component mounts
    document.addEventListener('keydown', handleKeyDown);

    (async () => {
      // await getUserCollectionn()
      let listings = await api.token(partyhatscanister).listings();
      let statsResponse = await api.token(partyhatscanister).stats();
      setListings(listings);
    })();

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

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever listings change
  }, [listings, filteredData]);

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

  const handleIndexChange = async (event) => {
    setIndex(event.target.value);
    let token = await extjs.encodeTokenId(
      partyhatscanister,
      event.target.value - 1
    );
    setIndexToken(token);
  };

  const handleSearch = () => {
    if (!isNaN(index) && index > 0 && index <= listings.length) {
      setCurrentPage(Math.ceil(index / itemsPerPage));
    } else {
      setCurrentPage(1);
    }
  };

  // const fetchTokenDetails = async (tokenId) => {
  //   try {
  //     const tokenDetails = await fetch(
  //       `https://us-central1-entrepot-api.cloudfunctions.net/api/token/${tokenId}`
  //     );
  //     return tokenDetails.json();
  //   } catch (error) {
  //     console.error("Error fetching token details:", error);
  //     return [];
  //   }
  // };

  const NftItem = ({ _viewMode, tokens, index, bg, price }) => {


    const formatPrice = (priceData) => {
      if (!priceData) return false; // Loading or not available
      // Assuming priceData.price is the value you want to format
      const formattedPrice = formatNumberToThreeDigits(priceData);
      return formattedPrice;
    };

    const formatNumberToThreeDigits = (bigNumber) => {
      // Convert BigInt to a Number for formatting, aware of potential precision loss for very large numbers
      let number = Number(bigNumber) / 100000000;

      // Define thresholds
      const thousand = 1e3; // Equivalent to 1000
      const million = 1e6;  // Equivalent to 1000000

      // Helper function for formatting
      function format(n, divisor, suffix) {
        let result = n / divisor;
        // For numbers where division brings them below 100, ensure two decimal places
        if (result < 100) {
          result = result.toFixed(2);
        } else {
          // Round to nearest integer for k and m to keep significant figure handling simple
          result = Math.round(result).toString();
        }
        return result + suffix;
      }

      // Determine and format based on range
      if (number < thousand) {
        // For numbers less than 1000, round and return as is
        return Math.round(number).toString();
      } else if (number < million) {
        // For thousands, use "k" suffix
        return format(number, thousand, 'k');
      } else {
        // For millions and above, use "m" suffix
        return format(number, million, 'm');
      }
    }

    const pid = Object.keys(nftStatic[index])[0] ;

    return (
      <div className={bg === 0 ? 'gradient-border' : 'black-border'}>
        <div className="card-container">
          <div key={index} className="nft-image-container">
            <img
              src={`./assets/saved_svgs/${tokens[index].id}.svg`}
              alt={`Item ${index + 1}`}
              className="nft-image"
            />
          </div>
          {
            _viewMode == 2 &&
            <div className="card-description-container">
              <div className="card-d-container-row">
                <p className="">#{tokens[index].mint}</p>
                {/* <div className="nri-container">
                  <p className="nri-text">47%</p>
                </div> */}
              </div>
              <div className="card-d-container-row">
                <div className="nft-price-container">
                  <p>{formatPrice(price[1]?.price)}</p>
                  <img
                    className={formatPrice(price[1]?.price) ? "dfinity-price-image" : "hide-price-logo"}
                    src="../src/assets/ICP.png"
                    alt="dfinity logo"
                  />
                </div>
                <a href={`https://toniq.io/marketplace/asset/${pid}`} className="buy-now-container" aria-label="Buy now" target="_blank" rel="noopener noreferrer">
                  <p className="buy-now-text">buy</p>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

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
              <a href="#" onClick={() => { setMobileFilter(1 - mobileFilter) }} className="filterIcon"><img src={filter_icon} alt="Filter View" width={20} /></a>
              {/* <a href="#" onClick={() => { setViewMode(1) }} style={{ border: (viewMode == 1 ? "1px solid white" : "0px") }}><img src={cardview_icon} alt="Image View" width={20} /></a> &nbsp; */}
              {/* <a href="#" onClick={() => { setFilterMode(1 - filterMode); handleReset(); }} className="one-∞"> {filterMode==0?1:"∞"} </a> &nbsp; */}
        </div>
        <Stats />
        {/* <div className="count-viewmodes-container">
            
        
        <div className="state-control-minus-logo">
          </div>
        </div> */}

      </div>
      <div className="grid-filter-container">
        <div className={mobileFilter == 1 ? "mobile-filter-container" : "filter-container"}>
          <FilterView count={filteredData.length} layer = {layer} filterMode = {filterMode}/>
        </div>
        <div className={"grid-container"} >
          <div className={viewMode == 1 ? "nft-container" : "nft-container-card-version"} onScroll={handleScroll} ref={containerRef}>
            {filteredData
              .slice(0, count)
              .map((token, index) => {
                return <NftItem _viewMode={viewMode} index={index} tokens={filteredData.slice(0, count)} bg={token.bg} price={token.price} />
                // return <NftItem index={index} tokens={filteredData.slice(0, count)} />
              })}
          </div>
        </div>
      </div>

    </div>
  </>
}

export default NFT_Grid;


//(currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)