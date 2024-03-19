import { useEffect, useState } from "react";
import { Principal } from "@dfinity/principal";
import Landing from "./pages/landing";
//import splash from "../assets/splash.png"
import "./App.css";
import extjs from "./ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";
import logo from "./assets/logo_1000x1000.png"

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

  // useEffect(() => {
  //   (async () =>
  //     await initJuno({
  //       satelliteId: "zggvx-3aaaa-aaaal-adxyq-cai"
  //     }))();
  // }, []);

  // const getUserCollectionn = async () => {
  //   let address = extjs.toAddress(
  //     "mnkns-ot2bw-totr7-hzfdh-npcio-ss4oz-dsc2e-6dheg-httzc-7d5ih-qqe",
  //     0
  //   );
  //   let data;
  //   var response = await fetch(
  //     "https://us-central1-entrepot-api.cloudfunctions.net/api/user/" +
  //       address +
  //       "/all"
  //   ).then((res) => res.json());
  //   data = response.data;
  //   data = data.map((a) => ({ ...a, token: a.id }));
  //   setUserColletion(data);
  // };

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
  // !loaded
  if (true) return <div className="loading-container">
    <div className="loading-inner-content-container">
      <img className="loading-logo" src={logo} alt="" />
      <p className="loading-text df-font">Built on the Internet Computer</p>
    </div>
  </div>;

  return (
    <div className="content">
      <Landing />
    </div>
  );
}

export default App;
