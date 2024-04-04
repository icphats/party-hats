import "./index.css"
import { useMyContext } from "../../context/MyContext.jsx";

function Stats() {

  const { liveStats } = useMyContext();

  return <div className="stats-brand-container">
    {liveStats && (
      <div>
        <div className="stats-container">
          <div className="stat">
            <p className="title">Floor</p>
            <p className="value">{liveStats.floor}</p>
          </div>
          <div className="stat">
            <p className="title">Volume</p>
            <p className="value">{liveStats.total}</p>
          </div>
          <div className="stat">
            <p className="title">Sold</p>
            <p className="value">{liveStats.sales}</p>
          </div>
          {/* <div className="stat">
            <p className="title">Owners</p>
            <p className="value">{stats.owners}</p>
          </div> */}
          <div className="stat">
            <p className="title">Listings</p>
            <p className="value">{liveStats.listings}</p>
          </div>
        </div>
      </div>
    )}
  </div>
}

export default Stats;