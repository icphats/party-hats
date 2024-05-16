import { useEffect, useState, useRef, useContext } from "react";
import "./index.css"
import Stats from "../Stats/index.jsx";
import NftItem from "./NFTItem.jsx";
import layer_assets from "../../utils/const.jsx";
import { useLayerContext } from "../../context/LayerContext.jsx";
import { useNftContext } from "../../context/NftContext.jsx";
import filter_icon from "../../assets/filter-icon.png";
import FilterView from "./FilterViewer.jsx";
import nftStatic from '../../utils/json/nft_static.json'
import logo from "../../assets/1000x1000.png"

function WebAppContent() {

  const [fullArray, setFullArray] = useState([]); // all listed and unlisted NFTs
  const [listedArray, setListedArray] = useState([]); // just listed NFTs
  const [truth, setTruth] = useState([]);

  const [viewMode, setViewMode] = useState(2);
  const [mobileFilter, setMobileFilter] = useState(0);

  const [count, setCount] = useState(300);
  const containerRef = useRef(null);
  const [layer, setLayer] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0)

  const [priceViewToggle, setPriceViewToggle] = useState(0);
  const [nriViewToggle, setNriViewToggle] = useState(0);

  const LAYERSECTIONS = ["background", "border", "emble", "glow", "phat"];
  const SCROLL_OFFSET = 1;  // Adjust based on your specific needs
  const ITEMS_INCREMENT = 30;  // Number of items to load on each increment
  

  const { 
    loaded,
    nftArray,
    liveStats,
    transactions,
    liveListings 
  } = useNftContext();

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
  } = useLayerContext();

  const handleViewMode = () => {
    setViewMode(viewMode === 1 ? 2 : 1);
    if (viewMode == 2) {
      if (count < 300) setCount(Math.min(300, truth.length));
    }
    if (viewMode == 1) {
      if (count < 200) setCount(Math.min(200, truth.length));
    }
  }

  const updateShowData2 = () => {
    let content = nftArray.reduce((acc, item) => {
        const layerData = item.assetlayers;
        if ((embleLayer.length === 0 || embleLayer.includes(layerData[0])) &&
            (borderLayer.length === 0 || borderLayer.includes(layerData[1])) &&
            (phatLayer.length === 0 || phatLayer.includes(layerData[2])) &&
            (glowLayer.length === 0 || glowLayer.includes(layerData[3])) &&
            (backgroundLayer.length === 0 || backgroundLayer.includes(layerData[4]))) {
            acc.push(item);
        }
        return acc;
    }, []);

    let newFullArray = content.map(item => pushOneItem(item));
    setFullArray(newFullArray);
    
    let newListedArray = newFullArray.filter(i => i.price) //price is null if not listed;
    setListedArray(newListedArray); //redundant storager for faster service

    setTruth(fullArray)
  }

  const pushOneItem = (item) => {
    let price = item.price ? item.price / 100000000 : null
    let bg = item.assetlayers[4];
    let mint = item.mint
    let pid = item.id
    let nri = item.nri
    console.log({ pid, mint, bg, price, nri })
    return{ pid, mint, bg, price, nri };
  }

// Update which layers are shown

  useEffect(() => {
    updateShowData2();
  }, [backgroundLayer, borderLayer, embleLayer, phatLayer, glowLayer])

  useEffect(() => {
    console.log(`loaded: ${loaded}`);
    updateShowData2();
  }, [loaded])

useEffect(() => {
  console.log(priceViewToggle, nriViewToggle);

  if(priceViewToggle === 1){
    setTruth(listedArray);
    if(nriViewToggle === 1) {
      let ascNri = [...listedArray].sort((a,b) => a.nri - b.nri)
      setTruth(ascNri)
    } else if (nriViewToggle === 2) {
      let descNri = [...listedArray].sort((a,b) => b.nri - a.nri)
      setTruth(descNri)
    }
  } else {
    switch(priceViewToggle){   
      case 0:
        setTruth(fullArray)
        break;
      case 2:
        let ascPrice = [...listedArray].sort((a,b) => a.price - b.price)
        setTruth(ascPrice)
        break;
      case 3:
        let descPrice = [...listedArray].sort((a,b) => b.price - a.price)
        setTruth(descPrice)
        break;
      default:
        setTruth(fullArray)
        break; 
    }
  
    switch(nriViewToggle){   
      case 0:
        break;
      case 1:
        let ascNri = [...fullArray].sort((a,b) => a.nri - b.nri)
        setTruth(ascNri)
        break;
      case 2:
        let descNri = [...fullArray].sort((a,b) => b.nri - a.nri)
        setTruth(descNri)
        break;
      default:
        break; 
    }
  }
}, [priceViewToggle, nriViewToggle, fullArray, listedArray])

const handleReset = () => {
  setBackgroundLayer([]);
  setBorderLayer([]);
  setEmbleLayer([]);
  setPhatLayer([]);
  setGlowLayer([]);
  setPriceViewToggle(0);
  setNriViewToggle(0);

  for(let i = 0; i < LAYERSECTIONS.length; i++){
    for(let j = 0; j < layer_assets[LAYERSECTIONS[i]]?.length; j++){
      let actualLayerName = layer_assets[LAYERSECTIONS[i]][j]
      let a = document.getElementById(actualLayerName)
      a.classList.remove("filter-active")
    }
  }

  updateShowData2()
}

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

    

    updateShowData2();
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleScroll = () => {
    const container = containerRef.current;
    if (container && container.scrollTop + container.clientHeight + SCROLL_OFFSET >= container.scrollHeight) {
      window.requestAnimationFrame(() => {
        setCount(prevCount => Math.min(prevCount + ITEMS_INCREMENT, truth.length));
        console.log("bottom reached");
      });
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

  return (
    <>
      <div className="state-control">
      <div className="logo-container">
        <img src={logo} className="icphats-logo" alt="icphats logo" />
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
          <FilterView setSearchIndex={setSearchIndex} layer = {layer} handleReset={handleReset} handleViewMode={handleViewMode} setPriceViewToggle={setPriceViewToggle} priceViewToggle={priceViewToggle} setNriViewToggle={setNriViewToggle} nriViewToggle={nriViewToggle}/>
        </div>
        <div className="grid-container" >
          <div className={viewMode == 1 ? "nft-container" : "nft-container-card-version"} onScroll={handleScroll} ref={containerRef}>
            {loaded && truth
              .slice(0, count)
              .map((nft, index) => {
                return <NftItem key={index} _viewMode={viewMode} index={index} bg={nft.bg} price={nft.price} pid={nft.pid} mint={nft.mint} nri={nft.nri} />
              })}
          </div>
        </div>
      </div>
    </>
  )
}

export default WebAppContent;


