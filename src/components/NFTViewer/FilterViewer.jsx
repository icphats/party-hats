import layer_assets from "../../utils/const";
import { LayerContext } from "./LayerContext";
import { useContext, useEffect } from "react";

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

    // console.log(FilterView);

    const handleClick = (layer, item) => {
        if(item.indexOf("_Ph") >= 0) setPhatLayer(phatLayer == item ? "" : item);
        else if(item.indexOf("_Em") >= 0) setEmbleLayer(embleLayer == item ? "" : item);
        else if(item.indexOf("_Gl") >= 0) setGlowLayer(glowLayer == item ? "" : item);
        else if(item.indexOf("_Bg") >= 0) setBackgroundLayer(backgroundLayer == item ? "" : item);
        else setBorderLayer(borderLayer == item ? "" : item);
    }

    const isSelected = (item) => {
        return backgroundLayer == item || borderLayer == item || embleLayer == item || phatLayer == item || glowLayer == item;
    }

    const assetClicked =() => {
        const assets = document.getElementsByClassName("filter_asset_container");
        for(let i = 0 ; i < assets.length; i ++){
            const asset = assets.item(i);
            if(asset.id == backgroundLayer || asset.id == borderLayer || asset.id == embleLayer || asset.id == phatLayer || asset.id == glowLayer)
                document.getElementById(asset.id).classList.add("filter-active");
            else document.getElementById(asset.id).classList.remove("filter-active");
        }
    }
    assetClicked();
    return (
        <div className="filter-preview">
            {/* <div>
                <div className="NFT-Count-Container">
                    <p className="NFT-count">{props.count}</p>
                </div>
            </div> */}
            {
                layers.map(layer => {
                    return <div className="layer-view">
                        {layer_assets[layer].
                            map(item =>
                                <div className="filter_asset_container" id={item} onClick={()=>{handleClick(layer, item)}}>
                                    <img
                                        width={26}
                                        height={26}
                                        src={`./assets/ICPhats_Collection/${layer}/${item}.png`}
                                    />
                                </div>
                            )}
                    </div>
                })

            }
        </div>
    )
}

export default FilterView;