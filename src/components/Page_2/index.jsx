import "./index.css"
import { Link } from 'react-router-dom';

import Stats from "./stats.jsx";
import NFT_Grid from "./nft_grid.jsx";
import Navbar from "./navbar.jsx";
import Search_Filter from "./search_filter.jsx";


function Page_2() { 

return <div className="splash-container-2">
  <Navbar></Navbar>
  <Stats></Stats>
  <Search_Filter></Search_Filter>
  <NFT_Grid></NFT_Grid>
  </div>
}

export default Page_2;