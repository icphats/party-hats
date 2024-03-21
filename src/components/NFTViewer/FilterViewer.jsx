import layer_assets from "../../utils/const";

const layers=["background","border","emble","glow","phat"];

const FilterView = () => {
    console.log("assets:",layer_assets);
    return (
        <>
            {
                layers.map(layer=>{
                    return layer_assets[layer].
                        map(item=>
                            <div className="filter_asset_container"><img width={38} height={38} src={`./assets/ICPhats_Collection/${layer}/${item}.png`}/></div>
                        )
                })
                
            }
        </>
    )
}

export default FilterView;