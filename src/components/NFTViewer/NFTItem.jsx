import "./index.css"

const NftItem = ({ _viewMode, tokens, index, bg, price, pid }) => {

    console.log()
    const formatPrice = (priceData) => {
      if (!priceData) return false; // Loading or not available
      // Assuming priceData.price is the value you want to format
      const formattedPrice = formatNumberToThreeDigits(priceData);
      return formattedPrice;
    };

    const formatNumberToThreeDigits = (bigNumber) => {
      // Convert BigInt to a Number for formatting, aware of potential precision loss for very large numbers
      let number = Number(bigNumber) / 100000000;
    
      // Define thresholds
      const thousand = 1e3; // Equivalent to 1000
      const million = 1e6;  // Equivalent to 1000000
    
      // Helper function for formatting
      function format(n, divisor, suffix) {
        let result = n / divisor;
        // For numbers where division brings them below 100, ensure two decimal places
        if (result < 100) {
          result = result.toFixed(2);
        } else {
          // Round to nearest integer for k and m to keep significant figure handling simple
          result = Math.round(result).toString();
        }
        return result + suffix;
      }
    
      // Determine and format based on range
      if (number < 1) {
        // For numbers less than 1, display with two decimal places
        return number.toFixed(2);
      } else if (number < thousand) {
        // For numbers less than 1000, round and return as is
        return Math.round(number).toString();
      } else if (number < million) {
        // For thousands, use "k" suffix
        return format(number, thousand, 'k');
      } else {
        // For millions and above, use "m" suffix
        return format(number, million, 'm');
      }
    }

    // const pid = Object.keys(nftStatic[index])[0] ;

    return (
      <div className={bg === 0 ? 'gradient-border' : 'black-border'}>
        <div className="card-container">
          <div key={index} className="nft-image-container">
            <img
              src={`./assets/saved_svgs/${tokens[index].id}.svg`}
              alt={`Item ${index + 1}`}
              className="nft-image"
            />
          </div>
          {
            _viewMode == 2 &&
            <div className="card-description-container">
              <div className="card-d-container-row">
                <p className="">#{tokens[index].mint}</p>
                {/* <div className="nri-container">
                  <p className="nri-text">47%</p>
                </div> */}
              </div>
              <div className="card-d-container-row">
                <div className="nft-price-container">
                  <p>{formatPrice(price[1]?.price)}</p>
                  <img
                    className={formatPrice(price[1]?.price) ? "dfinity-price-image" : "hide-price-logo"}
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