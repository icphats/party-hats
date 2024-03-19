import "./index.css"
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';


import extjs from "../../ic/extjs.js";
const api = extjs.connect("https://icp0.io/");
const partyhatscanister = "gq5kt-4iaaa-aaaal-qdhuq-cai";

function Stats() {
  const [listings, setListings] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState([]);



  useEffect(() => {
    (async () => {
      // await getUserCollectionn()
      let listings = await api.token(partyhatscanister).listings();
      let statsResponse = await api.token(partyhatscanister).stats();
      setListings(listings);
      setStats(statsResponse);
    })();
  }, []);


  return <div className="stats-brand-container">
    <a href="https://twitter.com/icphats" className="social_links" target="_blank" rel="noopener noreferrer">
      <img src="../../src/assets/x_logo.png" alt="Follow us on Twitter" style={{ width: '24px', height: '24px' }} />
    </a>
    {stats && (
      <div>
        <div className="stats-container">
          <div className="stat">
            <p className="title">Volume</p>
            <p className="value">{stats.total}</p>
          </div>
          <div className="stat">
            <p className="title">Owners</p>
            <p className="value">{stats.owners}</p>
          </div>
          <div className="stat">
            <p className="title">Floor</p>
            <p className="value">{stats.floor}</p>
          </div>
          <div className="stat">
            <p className="title">Listings</p>
            <p className="value">{stats.listings}</p>
          </div>
        </div>
      </div>
    )}
  </div>
}



export default Stats;