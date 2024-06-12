import { useRef, useEffect, useState } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftRightComponent = () => {
  const {
    viewMode,
    filteredArray,
    setShownCount,
    shownCount,
    increment,
    resetToggle,
  } = useNftContext();

  const SCROLL_OFFSET = 1; // Adjust based on your specific needs

  const scrollContainerRef = useRef(null);
  const scrollContainer = scrollContainerRef.current;

  const handleScroll = () => {
    if (
      scroll &&
      scrollContainer.scrollTop +
        scrollContainer.clientHeight +
        SCROLL_OFFSET >=
        scrollContainer.scrollHeight
    ) {
      window.requestAnimationFrame(() => {
        setShownCount((prev) => prev + increment);
      });
    }
  };

  useEffect(() => {
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [resetToggle]);

  return (
    <>
      {console.log(viewMode)}
      {
        <div className="grid-container">
          <div
            className={
              viewMode === 0 ? "nft-container" : "nft-container-card-version"
            }
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {filteredArray.slice(0, shownCount).map((nft, index) => {
              return <NftItem key={index} nft={nft} />;
            })}
          </div>
        </div>
      }
    </>
  );
};

export default NftRightComponent;
