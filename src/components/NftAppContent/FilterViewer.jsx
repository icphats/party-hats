import layer_assets from "../../utils/const";
import { useNftContext } from "../../context/NftContext";
import { useLayerContext } from "../../context/LayerContext";
import { useEffect, useState } from "react";
import ProfileRectangle from "../Profile/ProfileRectangle";
import gridview_icon from "../../assets/grid-view-icon.png";

const LAYERSECTIONS = ["background", "border", "emblem", "glow", "phat"];

const FilterView = () => {
  const {
    backgroundLayer,
    setBackgroundLayer,
    borderLayer,
    setBorderLayer,
    emblemLayer,
    setEmblemLayer,
    phatLayer,
    setPhatLayer,
    glowLayer,
    setGlowLayer,
  } = useLayerContext();

  const {
    priceViewToggle,
    setPriceViewToggle,
    nriViewToggle,
    setNriViewToggle,
    userPhatToggle,
    setUserPhatToggle,
    setViewMode,
    searchIndex,
    setSearchIndex,
    viewMode,
  } = useNftContext();

  const CUSTOM_GR = [
    52, 10, 26, 7, 21, 3, 18, 58, 22, 73, 36, 62, 47, 31, 1, 41, 43, 14, 49, 45,
    28, 16, 65, 55, 24,
  ];

  const [layerStatic, setLayer] = useState([]);
  const [priceSymbol, setPriceSymbol] = useState("$");
  const [nriSymbol, setNriSymbol] = useState("%");

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("./json/layers_static.json");
        const jsonData = await response.json();
        setLayer(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  const handleClick = (item) => {
    const asset = document.getElementById(item);
    let index = item.indexOf("_"); // Finds the index of the first underscore
    let layerName = item.slice(0, index);

    if (item === "Emblem___Gr") {
      if (asset.classList.contains("filter-active")) {
        asset.classList.remove("filter-active");
        setEmblemLayer(emblemLayer.filter((item) => !CUSTOM_GR.includes(item)));
      } else {
        asset.classList.add("filter-active");
        setEmblemLayer([...emblemLayer, ...CUSTOM_GR]);
      }
    } else {
      let layerIndex = layerStatic.findIndex((i) => i[0] === item);
      let assetIndexWithinLayer =
        layerStatic[layerIndex][1].asset_index_within_layer;

      if (asset.classList.contains("filter-active")) {
        asset.classList.remove("filter-active");

        // console.log(assetIndexWithinLayer);
        // console.log(emblemLayer);

        switch (layerName) {
          case "Emblem":
            setEmblemLayer(
              emblemLayer.filter((item) => item !== assetIndexWithinLayer)
            );
            break;
          case "Border":
            if (borderLayer.includes(assetIndexWithinLayer))
              setBorderLayer(
                borderLayer.filter((item) => item !== assetIndexWithinLayer)
              );
            break;
          case "Phat":
            if (phatLayer.includes(assetIndexWithinLayer))
              setPhatLayer(
                phatLayer.filter((item) => item !== assetIndexWithinLayer)
              );
            break;
          case "Glow":
            if (glowLayer.includes(assetIndexWithinLayer))
              setGlowLayer(
                glowLayer.filter((item) => item !== assetIndexWithinLayer)
              );
            break;
          case "Background":
            if (backgroundLayer.includes(assetIndexWithinLayer))
              setBackgroundLayer(
                backgroundLayer.filter((item) => item !== assetIndexWithinLayer)
              );
            break;
          default:
            console.log("Invalid layer");
            break;
        }
      } else {
        asset.classList.add("filter-active");

        switch (layerName) {
          case "Emblem":
            setEmblemLayer([...emblemLayer, assetIndexWithinLayer]);
            break;
          case "Border":
            setBorderLayer([...borderLayer, assetIndexWithinLayer]);
            break;
          case "Phat":
            setPhatLayer([...phatLayer, assetIndexWithinLayer]);
            break;
          case "Glow":
            setGlowLayer([...glowLayer, assetIndexWithinLayer]);
            break;
          case "Background":
            setBackgroundLayer([...backgroundLayer, assetIndexWithinLayer]);
            break;
          default:
            console.log("Invalid layer");
            break;
        }
      }
    }
  };

  const handleReset = () => {
    setSearchIndex("");
    setBackgroundLayer([]);
    setBorderLayer([]);
    setEmblemLayer([]);
    setPhatLayer([]);
    setGlowLayer([]);
    setPriceViewToggle(0);
    setNriViewToggle(0);
    for (let i = 0; i < LAYERSECTIONS.length; i++) {
      for (let j = 0; j < layer_assets[LAYERSECTIONS[i]]?.length; j++) {
        let actualLayerName = layer_assets[LAYERSECTIONS[i]][j];
        let a = document.getElementById(actualLayerName);
        a.classList.remove("filter-active");
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // Check if ESC key is pressed (keyCode 27)
        handleReset();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePriceView = () => {
    setPriceViewToggle((prev) => (Math.abs(prev) + 1) % 4);
  };

  const handleNriOrder = () => {
    setNriViewToggle((prev) => (Math.abs(prev) + 1) % 3);
  };

  useEffect(() => {
    switch (priceViewToggle) {
      case 0:
        setPriceSymbol("$");
        break;
      case 1:
        setPriceSymbol("$");
        break;
      case 2:
        setPriceSymbol("↑");
        break;
      case 3:
        setPriceSymbol("↓");
        break;
      default:
        setPriceSymbol("$");
        break;
    }
    switch (nriViewToggle) {
      case 0:
        setNriSymbol("%");
        break;
      case 1:
        setNriSymbol("↑");
        break;
      case 2:
        setNriSymbol("↓");
        break;
      default:
        setNriSymbol("%");
        break;
    }
    setSearchIndex("");
  }, [priceViewToggle, nriViewToggle]);

  return (
    <>
      {/* <ProfileRectangle /> */}
      <div className="NFT-Search-Container">
        <input
          type="number"
          className="NFT-search-input"
          placeholder="Mint #"
          value={searchIndex}
          onChange={(e) => setSearchIndex(e.target.value)} // Assuming setIndex updates the state
        />
      </div>
      <div className="filters-button-container">
        <a
          href="#"
          onClick={() => {
            setTrigger((prev) => prev + 1);
          }}
        >
          <div className="escape-icon">ESC</div>
        </a>
        <a href="#" onClick={() => setViewMode(viewMode === 1 ? 2 : 1)}>
          <img src={gridview_icon} alt="Card View" />
        </a>
        <a href="#" onClick={handlePriceView}>
          <div
            className={`price-view ${
              priceViewToggle > 0 ? "price-view-active" : ""
            }`}
          >
            <p>{priceSymbol}</p>
          </div>
        </a>
        <a href="#" onClick={handleNriOrder}>
          <div
            className={`nri-view ${nriViewToggle > 0 ? "nri-view-active" : ""}`}
          >
            <p>{nriSymbol}</p>
          </div>
        </a>
      </div>
      <div className="filter-preview">
        {LAYERSECTIONS.map((layer) => {
          return (
            <div key={layer} className="layer-view">
              {layer_assets[layer].map((item) => (
                <div
                  key={item}
                  className="filter_asset_container"
                  id={item}
                  onClick={() => {
                    handleClick(item);
                  }}
                >
                  <img
                    width={26}
                    height={26}
                    src={`./assets/layers/${layer}/${item}.png`}
                    className="filter-image"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FilterView;
