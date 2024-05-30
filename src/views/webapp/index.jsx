import WebAppContent from "../../components/NftAppContent";
import { LayerProvider } from "../../context/LayerContext";
import { NftContextProvider } from "../../context/NftContext";
import mixpanel from "mixpanel-browser";
import "./index.css";

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
          <WebAppContent />
        </div>
      </NftContextProvider>
    </LayerProvider>
  );
};

export default WebApp;
