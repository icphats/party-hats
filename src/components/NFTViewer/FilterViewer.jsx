import layer_assets from "../../utils/const";
import { LayerContext } from "./LayerContext";
import { useContext, useEffect , useState} from "react";
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
    const [layerStatic, setLayer] = useState([]);
    const mode = props.filterMode;
    const handleClick = (layer, item) => {
        layerStatic.map(asset => {
            let currentLayer, currentId;
            if(asset[0].toLowerCase().indexOf(item.toLowerCase()) == asset[0].length-item.length && asset[0].length-item.length>=0)
                currentLayer = asset[1].layer_index, currentId = asset[1].asset_index_within_layer;
            else return;

            if(currentLayer == 0){
                if(embleLayer.includes(currentId.toString())) setEmbleLayer(embleLayer.filter(item=> item!= currentId.toString()));
                else {
                    if(mode == 0)
                        setEmbleLayer([currentId.toString()])
                    else
                        setEmbleLayer([...embleLayer, currentId.toString()]);
                } 
            }
            if(currentLayer == 1){
                if(borderLayer.includes(currentId.toString())) setBorderLayer(borderLayer.filter(item=> item!= currentId.toString()));
                else {
                    if(mode == 0)
                        setBorderLayer([currentId.toString()])
                    else
                        setBorderLayer([...borderLayer, currentId.toString()]);
                } 
            }
            if(currentLayer == 2){
                if(phatLayer.includes(currentId.toString())) setPhatLayer(phatLayer.filter(item=> item!= currentId.toString()));
                else {
                    if(mode == 0)
                        setPhatLayer([currentId.toString()])
                    else
                        setPhatLayer([...phatLayer, currentId.toString()]);
                } 
            }
            if(currentLayer == 3){
                if(glowLayer.includes(currentId.toString())) setGlowLayer(glowLayer.filter(item=> item!= currentId.toString()));
                else {
                    if(mode == 0)
                        setGlowLayer([currentId.toString()])
                    else
                        setGlowLayer([...glowLayer, currentId.toString()]);
                } 
            }
            if(currentLayer == 4){
                if(backgroundLayer.includes(currentId.toString())) setBackgroundLayer(backgroundLayer.filter(item=> item!= currentId.toString()));
                else {
                    if(mode == 0)
                        setBackgroundLayer([currentId.toString()])
                    else
                        setBackgroundLayer([...backgroundLayer, currentId.toString()]);
                } 
            }
        });
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

    const isSelected = (item) => {
        return backgroundLayer == item || borderLayer == item || embleLayer == item || phatLayer == item || glowLayer == item;
    }

    const assetClicked = () => {
        const assets = document.getElementsByClassName("filter_asset_container");
        for(let i = 0 ; i < assets.length; i ++){
            const asset = assets.item(i);
            const current = layerStatic.filter(ast => {
                return ast[0].indexOf(asset.id) == (ast[0].length-asset.id.length) && (ast[0].length-asset.id.length)>=0;
            });
            if(current[0][1] && (current[0][1].layer_index == 0&&embleLayer.includes(current[0][1].asset_index_within_layer.toString())) ||
                (current[0][1].layer_index == 1&&borderLayer.includes(current[0][1].asset_index_within_layer.toString())) ||
                (current[0][1].layer_index == 2&&phatLayer.includes(current[0][1].asset_index_within_layer.toString())) ||
                (current[0][1].layer_index == 3&&glowLayer.includes(current[0][1].asset_index_within_layer.toString())) ||
                (current[0][1].layer_index == 4&&backgroundLayer.includes(current[0][1].asset_index_within_layer.toString())))
                document.getElementById(asset.id).classList.add("filter-active");
            else document.getElementById(asset.id).classList.remove("filter-active");
        }
    }
    if(layerStatic && layerStatic.length > 0){
        assetClicked();
    }
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