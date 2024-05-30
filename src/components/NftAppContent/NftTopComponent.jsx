import Stats from "../Stats/index.jsx";
import logo from "../../assets/1000x1000.png";
import filter_icon from "../../assets/filter-icon.png";
import { useNftContext } from "../../context/NftContext.jsx";

const NftTopComponent = () => {
  const { filteredArray, mobileFilter, setMobileFilter } = useNftContext();

  return (
    <>
      <div className="state-control">
        <div className="logo-container">
          <img src={logo} className="icphats-logo" alt="icphats logo" />
        </div>
        <div className="nft-count-container">
          <p>{filteredArray.length}</p>
        </div>
        <div className="viewmodes">
          <a
            href="#"
            onClick={() => {
              setMobileFilter(1 - mobileFilter);
            }}
            className="filterIcon"
          >
            <img src={filter_icon} alt="Filter View" width={26} />
          </a>
        </div>
        <Stats />
      </div>
    </>
  );
};

export default NftTopComponent;
