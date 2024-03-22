import { createContext, useState } from "react";

export const LayerContext = createContext();

export const LayerProvider = ({children}) => {
    const [backgroundLayer, setBackgroundLayer] = useState("");
    const [borderLayer, setBorderLayer] = useState("");
    const [glowLayer, setGlowLayer] = useState("");
    const [embleLayer, setEmbleLayer] = useState("");
    const [phatLayer, setPhatLayer] = useState("");

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