import "./index.css"

const NftItem = ({ _viewMode, index, bg, price, pid, mint }) => {

    const formatNumberToThreeDigits = (number) => {
      // Define thresholds
      const thousand = 1e3; // Equivalent to 1000
      const million = 1e6;  // Equivalent to 1,000,000
      const billion = 1e9;  // Equivalent to 1,000,000,000
  
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
          return parseFloat(number.toFixed(2)).toString();
      } else if (number < thousand) {
          // For numbers less than 1000, show exactly three significant digits
          return number.toPrecision(3);
      } else if (number < million) {
          // For thousands, use "k" suffix
          return format(number, thousand, 'k');
      } else if (number < billion) {
          // For millions, use "m" suffix
          return format(number, million, 'm');
      } else {
          // For billions and above, use "b" suffix
          return format(number, billion, 'b');
      }
    }
  


    return (
      <div className={bg === 0 ? 'gradient-border' : 'black-border'}>
        <div className="card-container">
          <div key={index} className="nft-image-container">
            <img
              src={`./assets/saved_svgs/${pid}.svg`}
              alt={`Item ${index + 1}`}
              className="nft-image"
            />
          </div>
          {
            _viewMode == 2 &&
            <div className="card-description-container">
              <div className="card-d-container-row">
                <p className="">#{mint}</p>
                {/* <div className="nri-container">
                  <p className="nri-text">47%</p>
                </div> */}
              </div>
              <div className="card-d-container-row">
                <div className="nft-price-container">
                  <p>{price ? formatNumberToThreeDigits(price) : ""}</p>
                  <img
                    className={price ? "dfinity-price-image" : "hide-price-logo"}
                    src="../assets/general/ICP.png"
                    alt="dfinity logo"
                  />
                </div>
                <a href={`https://toniq.io/marketplace/asset/${pid}`} className="buy-now-container" aria-label="Buy now" target="_blank" rel="noopener noreferrer">
                  <p className="buy-now-text">buy</p>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

  export default NftItem;