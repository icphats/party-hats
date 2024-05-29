import { useEffect, useRef } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftRightComponent = () => {
  const { loaded, viewMode, filteredArray, count } = useNftContext();

  const containerRef = useRef(null);

  const handleScroll = () => {
    const container = containerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight + SCROLL_OFFSET >=
        container.scrollHeight
    ) {
      window.requestAnimationFrame(() => {
        setCount((prevCount) =>
          Math.min(prevCount + ITEMS_INCREMENT, filteredArray.length)
        );
      });
    }
  };

  return (
    <div className="grid-container">
      <div
        className={
          viewMode == 1 ? "nft-container" : "nft-container-card-version"
        }
        onScroll={handleScroll}
        ref={containerRef}
      >
        {filteredArray.slice(0, count).map((nft, index) => {
          return <NftItem key={index} nft={nft} />;
        })}
      </div>
    </div>
  );
};

export default NftRightComponent;
