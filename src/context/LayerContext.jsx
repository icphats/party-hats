import { createContext, useContext, useState } from "react";

export const LayerContext = createContext();

export const useLayerContext = () => useContext(LayerContext);

export const LayerProvider = ({children}) => {
    const [backgroundLayer, setBackgroundLayer] = useState([]);
    const [borderLayer, setBorderLayer] = useState([]);
    const [glowLayer, setGlowLayer] = useState([]);
    const [embleLayer, setEmbleLayer] = useState([]);
    const [phatLayer, setPhatLayer] = useState([]);
    const [filterMode, setFilterMode] = useState(1);

    return (
        <LayerContext.Provider 
            value={{
                backgroundLayer,
                borderLayer,
                glowLayer,
                embleLayer,
                phatLayer,
                filterMode,
                setBackgroundLayer,
                setBorderLayer,
                setGlowLayer,
                setEmbleLayer,
                setPhatLayer,
                setFilterMode,
            }}
        >
            {children}
        </LayerContext.Provider>
    )
}