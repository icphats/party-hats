import Navbar from "../../components/Navbar";
import WebAppContent from "../../components/WebAppContent";
import { LayerProvider } from "../../context/LayerContext";
import PartyRoom from '../../components/Partyroom'
import { useEffect, useState } from "react";
import "./index.css";


const WebApp = () => {

    const [tab, setTab] = useState(0);
    const [page, setPage] = useState()


    const handleTabs = (number) => {
        setTab(number)
    }

    useEffect(() => {
        switch (tab) {
            case 0:
                setPage(<WebAppContent/>);
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
                        <WebAppContent/>
                    </div>   
                </div>    
        </LayerProvider>
    );
}

export default WebApp;
