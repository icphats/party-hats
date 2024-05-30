import { LayerProvider } from "../../context/LayerContext";
import { NftContextProvider } from "../../context/NftContext";

import NftTopComponent from "../../components/NftAppContent/NftTopComponent";
import NftLeftComponent from "../../components/NftAppContent/NftLeftComponent";
import NftRightComponent from "../../components/NftAppContent/NftRightComponent";

import mixpanel from "mixpanel-browser";
import "./index.css";
import "../../styles/nft-app-content.css";

const WebApp = () => {
  const token = import.meta.env.VITE_REACT_APP_MIXPANEL_TOKEN;
  if (token) {
    mixpanel.init(token, { debug: true, persistence: "localStorage" });
  } else {
    console.error("Mixpanel Token is missing.");
  }

  return (
    <LayerProvider>
      <NftContextProvider>
        <div className="web-app-content-container">
          <NftTopComponent />
          <div className="grid-filter-container">
            <NftLeftComponent />
            <NftRightComponent />
          </div>
        </div>
      </NftContextProvider>
    </LayerProvider>
  );
};

export default WebApp;
