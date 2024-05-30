import "./index.css";
import { useNftContext } from "../../context/NftContext.jsx";
import NftTopComponent from "./NftTopComponent.jsx";
import NftLeftComponent from "./NftLeftComponent.jsx";
import NftRightComponent from "./NftRightComponent.jsx";

function WebAppContent() {
  const { loaded } = useNftContext();

  return (
    <>
      <NftTopComponent />
      <div className="grid-filter-container">
        <NftLeftComponent />
        <NftRightComponent />
      </div>
    </>
  );
}

export default WebAppContent;
