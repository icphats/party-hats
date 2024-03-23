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
import FilterView from "./FilterViewer.jsx";
import nftStatic from '../../json/nft_static.json'

const NftItem = ({_viewMode, tokens, index}) => {
  return (
    <div className="gradient-border">
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
              <div className="nri-container">
                <p className="nri-text">47%</p>
              </div>
            </div>
            <div className="card-d-container-row">
              <div className="nft-price-container">
                <p>1.352</p>
                <img
                  className="dfinity-price-image"
                  src="../src/assets/ICP.png"
                  alt="dfinity logo"
                />
              </div>
              <div className="buy-now-container">
                <p className="buy-now-text">buy</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

function NFT_Grid() {
  const [viewMode, setViewMode] = useState(2);
  const [filter, showFilter] = useState(0);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(""); // State variable for index input\
  const [indexToken, setIndexToken] = useState("");
  const [count, setCount] = useState(0);
  const itemsPerPage = 150;
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
} = useContext(LayerContext);

  const updateShowData = () => {
    let bg=-1, bd=-1,em=-1,ph=-1,gl=-1;
    layer.map(asset=>{
      if(asset[0].toLowerCase().indexOf(backgroundLayer.toLowerCase()) >= 0 && backgroundLayer != "")
        bg = asset[1].asset_index_within_layer;
      if(asset[0].toLowerCase().indexOf(borderLayer.toLowerCase()) >= 0 && borderLayer != "")
        bd = asset[1].asset_index_within_layer;
      if(asset[0].toLowerCase().indexOf(embleLayer.toLowerCase()) >= 0 && embleLayer != "")
        em = asset[1].asset_index_within_layer;
      if(asset[0].toLowerCase().indexOf(phatLayer.toLowerCase()) >= 0 && phatLayer != "")
        ph = asset[1].asset_index_within_layer;
      if(asset[0].toLowerCase().indexOf(glowLayer.toLowerCase()) >= 0 && glowLayer != "")
        gl = asset[1].asset_index_within_layer;
    })
    console.log(bg,bd,em,ph,gl);
    const data = (() =>{
        let content = [];
        for(let i = 0 ; i < nftStatic.length ; i ++)
        {
          const layerData = nftStatic[i][Object.keys(nftStatic[i])[0]].assetlayers;
            if ((em == -1 || layerData[0] == em) &&
              (bd == -1 || layerData[1] == bd) &&
              (ph == -1 || layerData[2] == ph) && 
              (gl == -1 || layerData[3] == gl) &&
              (bg == -1 || layerData[4] == bg))
              content.push({id: Object.keys(nftStatic[i])[0], mint: nftStatic[i][Object.keys(nftStatic[i])[0]].mint});
        }
        return content;
    })();
    setFilteredData(data);
    setCount(50);
  }

  useEffect(()=>{
    updateShowData();
  }, [backgroundLayer,borderLayer, embleLayer, phatLayer, glowLayer])
  useEffect(() => {
    (async () => {
      // await getUserCollectionn()
      let listings = await api.token(partyhatscanister).listings();
      let statsResponse = await api.token(partyhatscanister).stats();
      setListings(listings);
      setStats(statsResponse);
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
  }, []);

  useEffect(() => {
    updateShowData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever listings change
  }, [listings, filteredData]);

  const totalPages = Math.ceil(listings.length / itemsPerPage);
  useEffect(() => {
    if (filteredData.length > 50)
      setCount(50);
    else setCount(filteredData.length);
  }, [filteredData]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container.scrollTop + container.clientHeight >= container.scrollHeight
    ) {
      setCount((count + 20) > filteredData.length ? filteredData.length : (count + 20));
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

  const fetchTokenDetails = async (tokenId) => {
    try {
      const tokenDetails = await fetch(
        `https://us-central1-entrepot-api.cloudfunctions.net/api/token/${tokenId}`
      );
      return tokenDetails.json();
    } catch (error) {
      console.error("Error fetching token details:", error);
      return [];
    }
  };

  return <>
    <div className="state-control">
      <div className="viewmodes">
      <h3>{filteredData.length}</h3> &nbsp;&nbsp;&nbsp;
        <a href="#" onClick={() => { showFilter(1-filter) }} className="filterIcon"><img src={filter_icon} alt="Filter View" width={20} /></a> &nbsp;
        <a href="#" onClick={() => { setViewMode(1) }} style={{ border: (viewMode == 1 ? "1px solid white" : "0px") }}><img src={cardview_icon} alt="Image View" width={20} /></a> &nbsp;
        <a href="#" onClick={() => { setViewMode(2) }} style={{ border: (viewMode == 2 ? "1px solid white" : "0px") }}><img src={gridview_icon} alt="Card View" width={20} /></a>
      </div>
      <Stats />
    </div>
    <div className="nft-viewer">
      <div className={filter==1?"mobile-filter-container" : "filter-container"}>
        <FilterView />
      </div>
      <div className={viewMode == 1 ? "grid-container" : "cards-container"} >
        <div className="nft-container" onScroll={handleScroll} ref={containerRef}>
        {filteredData
          .slice(0, count)
          .map((token, index) => {
            return <NftItem _viewMode={viewMode} index={index} tokens={filteredData.slice(0, count)} />
          })}
          </div>
      </div>
    </div>
  </>
}

export default NFT_Grid;


//(currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)