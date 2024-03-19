import banner from "../../assets/phats_banner_transp.gif"
import Navbar from "../../components/Layout/Navbar";
import Stats from "../../components/Stats";
import NFTViewer from "../../components/NFTViewer";
import "./index.css";
const Landing = () => {
    return (
        <>
            <div className = "Banner">
                <img className="front-banner" src={banner} alt="image" />
            </div>
            <div className = "Landing">
                <Navbar />
                {/* <Search_Filter></Search_Filter> */}
                <NFTViewer />
            </div>
        </>
    );
}

export default Landing;
