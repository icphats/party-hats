import { useState, useContext } from "react";
import { AccountContext } from "../../context/AccountContext";
import NftOptions from "./NftOptions";
import SendNFTForm from "./SendNFTForm";
import "./index.css";
import mixpanel from "mixpanel-browser";
import { useNftContext } from "../../context/NftContext";

const NftItem = (props) => {
  const { bg, price, pid, mint, nri } = props.nft;

  const { userPhats } = useContext(AccountContext);

  const { viewMode, filteredArray } = useNftContext();

  const formatNumberToThreeDigits = (number) => {
    // Define thresholds
    const thousand = 1e3; // Equivalent to 1000
    const million = 1e6; // Equivalent to 1,000,000
    const billion = 1e9; // Equivalent to 1,000,000,000

    // Helper function for formatting
    function format(n, divisor, suffix) {
      let result = n / divisor;
      let formattedResult;

      if (result < 10) {
        // If the result is less than 10, show two decimal places
        formattedResult = result.toFixed(2);
      } else if (result < 100) {
        // If the result is between 10 and 100, show one decimal place
        formattedResult = result.toFixed(1);
      } else {
        // If the result is between 100 and 999, show no decimal places
        formattedResult = Math.round(result).toString();
      }

      // Remove trailing zeroes and decimal point if not needed
      formattedResult = parseFloat(formattedResult).toString();
      return formattedResult + suffix;
    }

    // Determine and format based on range
    if (number < 1) {
      // For numbers less than 1, show up to two decimal places
      return number.toFixed(2).toString();
    } else if (number < thousand) {
      // For numbers less than 1000, show exactly three significant digits
      return number.toPrecision(3);
    } else if (number < million) {
      // For thousands, use "k" suffix
      return format(number, thousand, "k");
    } else if (number < billion) {
      // For millions, use "m" suffix
      return format(number, million, "m");
    } else {
      // For billions and above, use "b" suffix
      return format(number, billion, "b");
    }
  };

  const toPercent = (num) => {
    let final = num * 100;
    return `${final.toFixed(1)}%`;
  };

  const getHeatMapColor = () => {
    // Ensure the input is within the range of 0 to 1

    // Calculate the red component: always high but more vibrant as the value increases
    const red = 255;
    // Keep the green component at 0 for simplicity
    const green = 0;
    // Calculate the blue component: higher (more towards pink) for lower values, lower (more towards red) for higher values
    const blue = Math.floor(255 * (1 - nri));

    // if(nri > 0.99) {
    //   // return {
    //   //   border: ``,
    //   //   fill: `rgb(${red}, ${green}, ${blue}, 0.2)`,
    //   //   image: `linear-gradient(to right, #842481, #ED1E79, #29ABE2, #FBB03B, #F15A24)`
    //   // }
    // } else
    if (nri > 0.95) {
      return {
        border: `1px solid rgb(${red}, ${green}, ${blue})`,
        fill: `rgb(${red}, ${green}, ${blue}, 0.2)`,
        image: ``,
      };
    } else {
      return {
        border: `1px solid rgb(${red}, ${green}, ${blue})`,
        fill: `rgb(${red}, ${green}, ${blue}, 0.2)`,
        image: ``,
      };
    }
  };

  const handleBuyNowClick = (pid) => {
    mixpanel.track("Buy Now Clicked", {
      product_id: pid,
    });
  };

  return (
    <div className={bg === 0 ? "gradient-border" : "black-border"}>
      <div className="card-container">
        <div
          key={mint}
          className={`nft-image-container ${bg === 0 ? "black" : "white"}`}
        >
          <img
            src={`./assets/phats/${pid}.png`}
            alt={`Item ${mint}`}
            className="nft-image"
            loading="lazy"
          />
        </div>
        {viewMode == 2 && (
          <div className="card-description-container">
            <div className="card-d-container-row">
              <p className="">#{mint}</p>
              <div
                className="nri-container"
                style={{
                  border: `${getHeatMapColor().border}`,
                  backgroundColor: `${getHeatMapColor().fill}`,
                  backgroundImage: `${getHeatMapColor().image}`,
                }}
              >
                <div
                  className="nri-inside-container"
                  style={{
                    backgroundColor: nri > 0.99 ? "rgb(0, 0, 0)" : "",
                    display: "flex", // This makes the div shrink-wrap its content
                  }}
                >
                  <p className="nri-text">{toPercent(nri)}</p>
                </div>
              </div>
            </div>
            <div className="card-d-container-row">
              <div className="nft-price-container">
                <p>{price ? formatNumberToThreeDigits(price) : ""}</p>
                <img
                  className={price ? "dfinity-price-image" : "hide-price-logo"}
                  src="../assets/general/ICP.png"
                  alt="dfinity logo"
                  loading="lazy"
                />
              </div>

              {userPhats.includes(pid) ? (
                <NftOptions sendNft={sendNft} />
              ) : (
                <a
                  href={`https://toniq.io/marketplace/asset/${pid}`}
                  className="buy-now-container"
                  aria-label="Buy now"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleBuyNowClick(pid)}
                >
                  <p className="buy-now-text">buy</p>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NftItem;
