import { useRef, useEffect, useState } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftRightComponent = () => {
  const { viewMode, filteredArray, count } = useNftContext();

  const SCROLL_OFFSET = 1; // Adjust based on your specific needs
  const ITEMS_INCREMENT = 30; // Number of items to load on each increment

  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // Update dimensions on mount and when the window is resized
    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    console.log(containerHeight * containerWidth);
  }, [containerHeight, containerWidth]);

  const handleScroll = () => {
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
