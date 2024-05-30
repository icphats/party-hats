import { useNftContext } from "../../context/NftContext.jsx";
import FilterView from "./FilterViewer.jsx";

const NftLeftComponent = () => {
  const { mobileFilter } = useNftContext();

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
