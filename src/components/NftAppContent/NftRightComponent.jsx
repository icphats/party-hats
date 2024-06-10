import { useRef, useEffect, useState } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftRightComponent = () => {
  const { viewMode, filteredArray, setCount, count, loaded } = useNftContext();

  const SCROLL_OFFSET = 1; // Adjust based on your specific needs

  const volContainerRef = useRef(null);
  const volContainer = volContainerRef.current;

  console.log();

  const scrollContainerRef = useRef(null);
  const scrollContainer = scrollContainerRef.current;

  const [volume, setVolume] = useState(0);
  const [increment, setIncrement] = useState(0); // Number of items to load on each increment

  useEffect(() => {
    const updateDimensions = () => {
      if (volContainer) {
        setVolume(() => volContainer.clientHeight * volContainer.clientWidth);
      }
    };

    // Update dimensions on mount and when the window is resized
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [loaded]);

  useEffect(() => {
    let tempCount = 0;
    tempCount = Math.ceil(volume / 4000);
    setCount(Math.max(tempCount, count));
    setIncrement(tempCount);
  }, [volume]);

  const handleScroll = () => {
    if (
      scroll &&
      scrollContainer.scrollTop +
        scrollContainer.clientHeight +
        SCROLL_OFFSET >=
        scrollContainer.scrollHeight
    ) {
      window.requestAnimationFrame(() => {
        setCount(
          (prevCount) => prevCount + increment

          // Math.min(prevCount + increment, filteredArray.length)
        );
      });
    }
  };

  return (
    <>
      {
        <div className="grid-container" ref={volContainerRef}>
          <div
            className={
              viewMode == 1 ? "nft-container" : "nft-container-card-version"
            }
            onScroll={handleScroll}
            ref={scrollContainerRef}
          >
            {filteredArray.slice(0, count).map((nft, index) => {
              return <NftItem key={index} nft={nft} />;
            })}
          </div>
        </div>
      }
    </>
  );
};

export default NftRightComponent;
