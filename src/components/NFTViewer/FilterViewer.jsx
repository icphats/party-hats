import layer_assets from "../../utils/const";
import { LayerContext } from "./LayerContext";
import { useContext, useEffect , useState} from "react";
import gridview_icon from "../../assets/grid-view-icon.png"
const layers = ["background", "border", "emble", "glow", "phat"];

const FilterView = (props) => {
    const {
        backgroundLayer,
        setBackgroundLayer,
        borderLayer,
        setBorderLayer,
        embleLayer,
        setEmbleLayer,
        phatLayer,
        setPhatLayer,
        glowLayer,
        setGlowLayer
    } = useContext(LayerContext);

    const CUSTOM_GR = [52,10,26,7,21,3,18,58,22,73,36,62,47,31,1,41,43,14,49,45,28,16,65,55,24];
    const [layerStatic, setLayer] = useState([]);

    const handleClick = (item) => {
      
        const asset = document.getElementById(item);
        let index = item.indexOf('_');  // Finds the index of the first underscore
        let layerName = item.slice(0, index);

        if(item === "Emblem___Gr"){

            if(asset.classList.contains("filter-active")){
                asset.classList.remove("filter-active");
                setEmbleLayer(embleLayer.filter(item => !CUSTOM_GR.includes(item)));
            } else {
                asset.classList.add("filter-active");
                setEmbleLayer([...embleLayer, ...CUSTOM_GR])
            }

        } else {
    
            let layerIndex = layerStatic.findIndex(i => i[0] === item)
            let assetIndexWithinLayer = layerStatic[layerIndex][1].asset_index_within_layer


            if(asset.classList.contains("filter-active")){
                asset.classList.remove("filter-active");
                
                switch (layerName) {
                    case "Emblem":
                            setEmbleLayer(embleLayer.filter(item => item !== assetIndexWithinLayer));
                        break;
                    case "Border":
                        if (borderLayer.includes(assetIndexWithinLayer))
                            setBorderLayer(borderLayer.filter(item => item !== assetIndexWithinLayer));
                        break;
                    case "Phat":
                        if (phatLayer.includes(assetIndexWithinLayer))
                            setPhatLayer(phatLayer.filter(item => item !== assetIndexWithinLayer));
                        break;
                    case "Glow":
                        if (glowLayer.includes(assetIndexWithinLayer))
                            setGlowLayer(glowLayer.filter(item => item !== assetIndexWithinLayer));
                        break;
                    case "Background":
                        if (backgroundLayer.includes(assetIndexWithinLayer))
                            setBackgroundLayer(backgroundLayer.filter(item => item !== assetIndexWithinLayer));
                        break;
                    default:
                        console.log("Invalid layer");
                        break;
                }
            }
            else {
                asset.classList.add("filter-active");

                switch (layerName) {
                    case "Emblem":
                            setEmbleLayer([...embleLayer, assetIndexWithinLayer]);
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
    }

    useEffect(()=>{
        (async () => {
            try {
              const response = await fetch('./json/layers_static.json');
              const jsonData = await response.json();
              setLayer(jsonData);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
        })();
    }, [])


    return (<>
                <div className="NFT-Search-Container">
                    <input
                    type="number"
                    className="NFT-search-input"
                    placeholder="Mint #"
                    onChange={(e) => props.setSearchIndex(e.target.value)} // Assuming setIndex updates the state
                    />
                </div>
                <div className="filters-button-container">
                    <a href="#"  onClick={() => { props.handleReset() }} ><div className="escape-icon">ESC</div></a>
                    <a href="#" onClick={() => { props.handleViewMode() }}><img src={gridview_icon} alt="Card View" /></a>
                    <a href="#" onClick={() => { props.setPriceViewToggle((Math.abs(props.priceViewToggle) + 1) % 4) }}><div className={`price-view ${props.priceViewToggle > 0 ? "price-view-active" : ""}`}><p>{props.priceSymbol}</p></div></a>
                    {/* <a href="#" onClick={() => { }}><div className={`nri-view`}><p>{props.priceSymbol}</p></div></a> */}
                </div>
                <div className="filter-preview">
                    {
                        layers.map(layer => {
                            return <div key={layer} className="layer-view">
                                {layer_assets[layer].
                                    map(item =>
                                        <div key={item} className="filter_asset_container" id={item} onClick={()=>{handleClick(item)}}>
                                            <img
                                                width={26}
                                                height={26}
                                                src={`./assets/ICPhats_Collection/${layer}/${item}.png`}
                                                className="filter-image"
                                            />
                                        </div>
                                    )}
                            </div>
                        })

                    }
                </div>
            </>)}

export default FilterView;