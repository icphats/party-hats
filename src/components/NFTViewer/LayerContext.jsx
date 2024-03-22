import { createContext, useState } from "react";

export const LayerContext = createContext();

export const LayerProvider = ({children}) => {
    const [backgroundLayer, setBackgroundLayer] = useState(0);
    const [borderLayer, setBorderLayer] = useState(0);
    const [glowLayer, setGlowLayer] = useState(0);
    const [embleLayer, setEmbleLayer] = useState(0);
    const [phatLayer, setPhatLayer] = useState(0);

    return (
        <LayerContext.Provider 
            value={{
                backgroundLayer,
                borderLayer,
                glowLayer,
                embleLayer,
                phatLayer,
                setBackgroundLayer,
                setBorderLayer,
                setGlowLayer,
                setEmbleLayer,
                setPhatLayer
            }}
        >
            {children}
        </LayerContext.Provider>
    )

}