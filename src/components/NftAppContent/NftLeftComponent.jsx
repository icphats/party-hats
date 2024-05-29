import { useNftContext } from "../../context/NftContext.jsx";
import { useState } from "react";
import FilterView from "./FilterViewer.jsx";

const NftLeftComponent = () => {
  const [mobileFilter, setMobileFilter] = useState(0);

  return (
    <>
      <div
        className={
          mobileFilter == 1 ? "mobile-filter-container" : "filter-container"
        }
      >
        <FilterView />
      </div>
    </>
  );
};

export default NftLeftComponent;
