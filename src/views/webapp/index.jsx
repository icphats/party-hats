import WebAppContent from "../../components/NftAppContent";
import { LayerProvider } from "../../context/LayerContext";
import "./index.css";
import mixpanel from "mixpanel-browser";

const WebApp = () => {
  const token = import.meta.env.VITE_REACT_APP_MIXPANEL_TOKEN;
  if (token) {
    mixpanel.init(token, { debug: true, persistence: "localStorage" });
  } else {
    console.error("Mixpanel Token is missing.");
  }

  return (
    <LayerProvider>
      <div className="web-app-content-container">
        <WebAppContent />
      </div>
    </LayerProvider>
  );
};

export default WebApp;
