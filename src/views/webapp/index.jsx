import WebAppContent from "../../components/NftAppContent";
import logo from "../../assets/1000x1000.png";
import { LayerProvider } from "../../context/LayerContext";
import { useNftContext } from "../../context/NftContext";
import Stats from "../../components/Stats";
import "./index.css";
import mixpanel from "mixpanel-browser";

const WebApp = () => {
  const { filteredArray } = useNftContext();

  console.log(filteredArray);

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
