import { useRef, useEffect, useState } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftRightComponent = () => {
  const { viewMode, filteredArray, setCount, count } = useNftContext();

  const SCROLL_OFFSET = 1; // Adjust based on your specific needs

  const containerRef = useRef(null);
  const container = containerRef.current;
  const [volume, setVolume] = useState(0);
  const [increment, setIncrement] = useState(30); // Number of items to load on each increment

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setVolume(
          () =>
            containerRef.current.clientHeight * containerRef.current.clientWidth
        );
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
    let tempCount = 0;
    if (viewMode == 1) {
      tempCount = volume / 40000;
      setCount(Math.max(tempCount, count));
      setIncrement(tempCount);
    }
    if (viewMode == 2) {
      tempCount = volume / 6000;
      setCount(Math.max(tempCount, count));
      setIncrement(tempCount);
    }
  }, [volume]);

  const handleScroll = () => {
    if (
      container &&
      container.scrollTop + container.clientHeight + SCROLL_OFFSET >=
        container.scrollHeight
    ) {
      window.requestAnimationFrame(() => {
        setCount((prevCount) =>
          Math.min(prevCount + increment, filteredArray.length)
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
