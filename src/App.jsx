import { useEffect, useState } from "react";
import banner from './assets/homepage_banner.gif'
import viteLogo from '/vite.svg'
import './App.css'
import extjs from './ic/extjs.js';
const api = extjs.connect('https://icp0.io/');



function App() {
  const [count, setCount] = useState(0)
  const[listings, setListings] = useState([])

  useEffect(()=>{

  },[listings])


  useEffect(() => {
    (async () => {
      console.log("before calling the api")
      let listings = await api.token('gq5kt-4iaaa-aaaal-qdhuq-cai').listings();
      console.log("result",listings)
      setListings(listings)
    } 
    )();
  }, []);

  return (
    <>
      <div>
          <img src={banner} className="banner" alt="home banner" />
      </div>
      {/* <h1>ICP PARTY HATS</h1> */}
      <h2>COMING SOON!</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      {listings.map((item)=>{
        <div>
          {item}
        </div>
      })}
    </>
  )
}

export default App
