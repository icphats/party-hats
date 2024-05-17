import "./index.css"
import { useNftContext } from "../../context/NftContext.jsx";
import { useEffect, useState } from "react";

function Stats() {

  const { liveStatsNew } = useNftContext();

  const [floor, setFloor] = useState("")
  const [volume, setVolume] = useState("")
  const [sold, setSold] = useState("")
  const [listings, setListings] = useState("")

  useEffect(() => {
    setFloor(Number(liveStatsNew[3]));
    setVolume(Number(liveStatsNew[0]));
    setSold(Number(liveStatsNew[6]));
    setListings(Number(liveStatsNew[4]));
  },[liveStatsNew])


  return <div className="stats-brand-container">
    {liveStatsNew && (
      <div>
        <div className="stats-container">
          <div className="stat">
            <p className="title">Floor</p>
            <p className="value">{floor ? (floor/ 100000000).toFixed(2) : "--"}</p>
          </div>
          <div className="stat">
            <p className="title">Volume</p>
            <p className="value">{volume ? (volume / 100000000).toFixed(1) : "--"}</p>
          </div>
          <div className="stat">
            <p className="title">Sold</p>
            <p className="value">{sold ? sold : "--"}</p>
          </div>
          {/* <div className="stat">
            <p className="title">Owners</p>
            <p className="value">{stats.owners}</p>
          </div> */}
          <div className="stat">
            <p className="title">Listings</p>
            <p className="value">{listings ? listings : "--"}</p>
          </div>
        </div>
      </div>
    )}
  </div>
}

export default Stats;