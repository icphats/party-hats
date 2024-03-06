import { useEffect, useState } from "react";
import banner from './assets/homepage_banner.gif'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "zggvx-3aaaa-aaaal-adxyq-cai"
      }))();
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
    </>
  )
}

export default App
