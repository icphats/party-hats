import Navbar from "../../components/Layout/Navbar";
import NFTViewer from "../../components/NFTViewer";
import { LayerProvider } from "../../components/NFTViewer/LayerContext";
import PartyRoom from '../../components/Partyroom'
import { useEffect, useState } from "react";
import "./index.css";


const Landing = () => {

    const [tab, setTab] = useState(0);
    const [page, setPage] = useState()


    const handleTabs = (number) => {
        setTab(number)
    }

    useEffect(() => {
        switch (tab) {
            case 0:
                setPage(<NFTViewer/>);
                break;
            case 1:
                setPage(<PartyRoom/>);
                break;
            default:
                setPage(<PartyRoom/>);
                break;
        }
    }, [tab]);

    return (
        <LayerProvider>
                <div className="web-app-container">
                    {/* <Navbar handleTabs={handleTabs}/> */}
                    <div className="web-app-content-container">
                        {page}
                    </div>   
                </div>    
        </LayerProvider>
    );
}

export default Landing;
