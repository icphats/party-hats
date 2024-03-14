import { useEffect, useState } from "react";
import banner from "./assets/homepage_banner.gif";
import { Principal } from "@dfinity/principal";
//import splash from "../assets/splash.png"
import "./App.css";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

function App() {
  const [listings, setListings] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [index, setIndex] = useState(""); // State variable for index input\
  const [indexToken, setIndexToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [userCollectionState, setUserColletion] = useState([]);
  const itemsPerPage = 50;

  const getUserCollectionn = async () => {
    // const user = 'mnkns-ot2bw-totr7-hzfdh-npcio-ss4oz-dsc2e-6dheg-httzc-7d5ih-qqe'
    // let collectionArray = []
    // for( let i =0; i<10000-1; i++){
    //   const tokenId = await extjs.encodeTokenId(
    //     partyhatscanister,
    //     i
    //   );
    //     const collectionItem = await api.token(partyhatscanister).userCollection(tokenId,Principal.fromText(user))
    //     if(collectionItem && collectionItem.ok && Number(collectionItem.ok)===1){
    //       collectionArray.push({tokenId})
    //     }

    // }
    // console.log("collection",collectionArray)
    let address = extjs.toAddress(
      "mnkns-ot2bw-totr7-hzfdh-npcio-ss4oz-dsc2e-6dheg-httzc-7d5ih-qqe",
      0
    );
    let data;
    var response = await fetch(
      "https://us-central1-entrepot-api.cloudfunctions.net/api/user/" +
        address +
        "/all"
    ).then((res) => res.json());
    data = response.data;
    data = data.map((a) => ({ ...a, token: a.id }));
    console.log("data", response);
    setUserColletion(data);
  };

  useEffect(() => {}, [loaded, userCollectionState]);

  useEffect(() => {
    (async () => {
      // await getUserCollectionn()
      let listings = await api.token(partyhatscanister).listings();
      let statsResponse = await api.token(partyhatscanister).stats();
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
            (currentPage - 1) * itemsPerPage + i
          );
          const details = await fetchTokenDetails(tokenId);
          console.log("detail", details);
          tokenPromises.push({ tokenId, details });
        }
        const tokenIds = await Promise.all(tokenPromises);
        setTokens(tokenIds);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    fetchListings();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 whenever listings change
  }, [listings, tokens]);

  const totalPages = Math.ceil(listings.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleIndexChange = async (event) => {
    setIndex(event.target.value);
    let token = await extjs.encodeTokenId(
      partyhatscanister,
      event.target.value - 1
    );
    setIndexToken(token);
  };

  const handleSearch = () => {
    if (!isNaN(index) && index > 0 && index <= listings.length) {
      setCurrentPage(Math.ceil(index / itemsPerPage));
    } else {
      setCurrentPage(1);
    }
  };

  const fetchTokenDetails = async (tokenId) => {
    try {
      const tokenDetails = await fetch(
        `https://us-central1-entrepot-api.cloudfunctions.net/api/token/${tokenId}`
      );
      return tokenDetails.json();
    } catch (error) {
      console.error("Error fetching token details:", error);
      return [];
    }
  };

  //   if (!loaded) return  <div className="app" style={{ backgroundImage: `url(${splash})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
  //   {/* Your other content goes here */}
  // </div>;

  if (!loaded) return <div className="splash-container"></div>;

  return (
    <div className="content">
      <div className="splash-container"></div>
      {/* <div className="banner-container">
        <img src={banner} className="banner" alt="home banner" />
      </div> */}
      {stats && (
        <div className="volumen-stat">
          <h3 claaName="volumen-stat">volumen</h3>
          <h1 claaName="volumen-stat">{stats.total}</h1>
          <div class="stats-container">
            <div class="stat">
              <p class="title">Owners:</p>
              <p class="value">{stats.listings}</p>
            </div>
            <div class="stat">
              <p class="title">Floor  : {" "}{" "}</p>
              <p class="value">{stats.floor}</p>
            </div>
            <div class="stat">
              <p class="title">Listings:</p>
              <p class="value">{stats.listings}</p>
            </div>
          </div>
        </div>
      )}
      <div className="grid-container">
        {listings
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((tokenId, index) => {
            console.log("token", tokens[index]);
            return (
              <div class="gradient-border">
                <div className="card-container">
                  <div key={index} className="nft-image-container">
                    <img
                      src={`https://gq5kt-4iaaa-aaaal-qdhuq-cai.raw.icp0.io/?tokenid=${
                        tokens && tokens[index].tokenId
                      }`}
                      alt={`Item ${index + 1}`}
                      className="nft-image"
                    />
                  </div>
                  <div className="card-description-container">
                    <div className="card-d-container-row">
                      <p className="">#{index + 1}</p>
                      <div className="nri-container">
                        <p className="nri-text">47%</p>
                      </div>
                    </div>
                    <div className="card-d-container-row">
                      <div className="nft-price-container">
                        <p>1.384</p>
                        <img
                          className="dfinity-price-image"
                          src="../src/assets/ICP.png"
                          alt="dfinity logo"
                        />
                      </div>
                      <div className="buy-now-container">
                        <p className="buy-now-text">buy</p>
                      </div>
                    </div>
                  </div>
                </div>
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
