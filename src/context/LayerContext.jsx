import { createContext, useContext, useState } from "react";

export const LayerContext = createContext();

export const useLayerContext = () => useContext(LayerContext);

export const LayerProvider = ({ children }) => {
  const [backgroundLayer, setBackgroundLayer] = useState([]);
  const [borderLayer, setBorderLayer] = useState([]);
  const [glowLayer, setGlowLayer] = useState([]);
  const [emblemLayer, setEmblemLayer] = useState([]);
  const [phatLayer, setPhatLayer] = useState([]);
  const [filterMode, setFilterMode] = useState(1);

  return (
    <LayerContext.Provider
      value={{
        backgroundLayer,
        borderLayer,
        glowLayer,
        emblemLayer,
        phatLayer,
        filterMode,
        setBackgroundLayer,
        setBorderLayer,
        setGlowLayer,
        setEmblemLayer,
        setPhatLayer,
        setFilterMode,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};
