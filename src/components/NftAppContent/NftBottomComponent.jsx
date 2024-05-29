import { useEffect, useRef } from "react";
import { useNftContext } from "../../context/NftContext";
import NftItem from "./NFTItem";

const NftBottomComponent = () => {
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // Check if ESC key is pressed (keyCode 27)
        handleReset();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // (async () => {
    //   try {
    //     const response = await fetch("./json/layers_static.json");
    //     const jsonData = await response.json();
    //     setLayer(jsonData);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // })();

    // updateShowData2();
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="grid-container">
      <div
        className={
          viewMode == 1 ? "nft-container" : "nft-container-card-version"
        }
        onScroll={handleScroll}
        ref={containerRef}
      >
        {loaded &&
          filteredArray.slice(0, count).map((nft, index) => {
            return (
              <NftItem
                key={index}
                _viewMode={viewMode}
                index={index}
                bg={nft.bg}
                price={nft.price}
                pid={nft.pid}
                mint={nft.mint}
                nri={nft.nri}
              />
            );
          })}
      </div>
    </div>
  );
};

export default NftBottomComponent;
