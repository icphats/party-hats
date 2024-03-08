import { useEffect, useState } from "react";
import banner from "./assets/homepage_banner.gif";
import "./App.css";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

function App() {
  const [listings, setListings] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  useEffect(() => {
    (async () => {
      console.log("before calling the api");
      let listings = await api.token(partyhatscanister).listings();
      let statsResponse = await api.token(partyhatscanister).stats();
      console.log("result", listings);
      console.log("stats", stats);
      setListings(listings);
      setStats(statsResponse);
    })();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const tokenPromises = [];
        for (let i = 0; i < itemsPerPage; i++) {
          const tokenId = await extjs.encodeTokenId(
            partyhatscanister,
            (currentPage - 1) * itemsPerPage + i + 1
          );
          tokenPromises.push(tokenId);
        }
        const tokenIds = await Promise.all(tokenPromises);
        console.log("tokenid after promises", tokenIds);
        setTokens(tokenIds);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever listings change
  }, [listings]);

  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="content">
      <div className="banner-container">
        <img src={banner} className="banner" alt="home banner" />
      </div>
      {stats && (
        <div className="stats-container">
          <p className="stat">owners: {stats.total}</p>
          <p className="stat">Floor: {stats.floor}</p>
          <p className="stat">Listings: {stats.listings}</p>
        </div>
      )}

      <div className="grid-container">
        {listings
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((tokenId, index) => {
            console.log("token", tokens[index]);
            return (
              <div key={index} className="nft-item">
                <img
                  src={`https://gq5kt-4iaaa-aaaal-qdhuq-cai.raw.icp0.io/?tokenid=${tokens[index]}`}
                  alt={`Item ${index + 1}`}
                  className="nft-image"
                />
              </div>
            );
          })}
      </div>
      <div className="pagination">
        {currentPage > 8 && (
          <button onClick={() => handlePageChange(currentPage - 8)}>
            Previous
          </button>
        )}
        {Array.from({ length: totalPages > 8 ? 8 : totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
        {currentPage + 8 <= totalPages && (
          <button onClick={() => handlePageChange(currentPage + 8)}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
