import { useEffect, useState, useRef, useContext } from "react";
import "./index.css";
import NftItem from "./NFTItem.jsx";
import layer_assets from "../../utils/const.jsx";
import { useLayerContext } from "../../context/LayerContext.jsx";
import { useNftContext } from "../../context/NftContext.jsx";
import FilterView from "./FilterViewer.jsx";
import { AccountContext } from "../../context/AccountContext.jsx";
import NftTopComponent from "./NftTopComponent.jsx";
import NftLeftComponent from "./NftLeftComponent.jsx";
import NftRightComponent from "./NftRightComponent.jsx";

function WebAppContent() {
  // const [layer, setLayer] = useState([]);

  const LAYERSECTIONS = ["background", "border", "emblem", "glow", "phat"];
  const SCROLL_OFFSET = 1; // Adjust based on your specific needs
  const ITEMS_INCREMENT = 30; // Number of items to load on each increment

  const {
    loaded,
    nftArray,
    priceViewToggle,
    setPriceViewToggle,
    nriViewToggle,
    setNriViewToggle,
    userPhatToggle,
    setUserPhatToggle,
    setSearchIndex,
  } = useNftContext();

  const { userPhats } = useContext(AccountContext);

  const {
    backgroundLayer,
    borderLayer,
    emblemLayer,
    phatLayer,
    glowLayer,
    setBackgroundLayer,
    setBorderLayer,
    setEmblemLayer,
    setPhatLayer,
    setGlowLayer,
    fullArray,
    listedArray,
  } = useLayerContext();

  // const handleViewMode = () => {
  //   if (viewMode == 2) {
  //     if (count < 300) setCount(Math.min(300, truth.length));
  //   }
  //   if (viewMode == 1) {
  //     if (count < 200) setCount(Math.min(200, truth.length));
  //   }
  // };

  // useEffect(() => {
  //   updateShowData2();
  // }, [backgroundLayer, borderLayer, emblemLayer, phatLayer, glowLayer]);

  // useEffect(() => {
  //   updateShowData2();
  // }, [loaded]);

  // useEffect(() => {
  //   if (userPhatToggle) {
  //     setTruth(userPhatArray);
  //   } else {
  //     setTruth(fullArray);
  //   }
  // }, [userPhatToggle]);

  const handleReset = () => {
    setBackgroundLayer([]);
    setBorderLayer([]);
    setEmblemLayer([]);
    setPhatLayer([]);
    setGlowLayer([]);
    setPriceViewToggle(0);
    setNriViewToggle(0);
    setSearchIndex("");
    setCount(300);

    for (let i = 0; i < LAYERSECTIONS.length; i++) {
      for (let j = 0; j < layer_assets[LAYERSECTIONS[i]]?.length; j++) {
        let actualLayerName = layer_assets[LAYERSECTIONS[i]][j];
        let a = document.getElementById(actualLayerName);
        a.classList.remove("filter-active");
      }
      updateShowData2();
    }
  };

  return (
    <>
      {loaded && (
        <>
          <NftTopComponent />
          <div className="grid-filter-container">
            <NftLeftComponent />
            <NftRightComponent />
          </div>
        </>
      )}
    </>
  );
}

export default WebAppContent;
