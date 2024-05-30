  //Arrays to Delete
  const [fullArray, setFullArray] = useState([]); // all listed and unlisted NFTs
  const [listedArray, setListedArray] = useState([]); // just listed NFTs
  const [userPhatArray, setUserPhatArray] = useState([]);

  const [truth, setTruth] = useState([]);


    // const [layer, setLayer] = useState([]);



const updateShowData2 = () => {
    let content = nftArray.reduce((acc, item) => {
      const layerData = item.assetlayers;
      if (
        (emblemLayer.length === 0 || emblemLayer.includes(layerData[0])) &&
        (borderLayer.length === 0 || borderLayer.includes(layerData[1])) &&
        (phatLayer.length === 0 || phatLayer.includes(layerData[2])) &&
        (glowLayer.length === 0 || glowLayer.includes(layerData[3])) &&
        (backgroundLayer.length === 0 || backgroundLayer.includes(layerData[4]))
      ) {
        acc.push(item);
      }
      return acc;
    }, []);

    let newFullArray = content.map((item) => pushOneItem(item));
    setFullArray(newFullArray);

    let newListedArray = newFullArray.filter((i) => i.price); //price is null if not listed;
    setListedArray(newListedArray); //redundant storager for faster service

    let newPhatArray = newFullArray.filter((i) => userPhats.includes(i.pid));
    setUserPhatArray(newPhatArray);
    // console.log(userPhatArray);

    setTruth(fullArray);
  };


  const pushOneItem = (item) => {
    let price = item.price ? item.price / 100000000 : null;
    let bg = item.assetlayers[4];
    let mint = item.mint;
    let pid = item.id;
    let nri = item.nri;
    return { pid, mint, bg, price, nri };
  };


  useEffect(() => {
    if (priceViewToggle === 1) {
      setTruth(listedArray);
      if (nriViewToggle === 1) {
        let ascNri = [...listedArray].sort((a, b) => a.nri - b.nri);
        setTruth(ascNri);
      } else if (nriViewToggle === 2) {
        let descNri = [...listedArray].sort((a, b) => b.nri - a.nri);
        setTruth(descNri);
      }
    } else {
      switch (priceViewToggle) {
        case 0:
          setTruth(fullArray);
          break;
        case 2:
          let ascPrice = [...listedArray].sort((a, b) => a.price - b.price);
          setTruth(ascPrice);
          break;
        case 3:
          let descPrice = [...listedArray].sort((a, b) => b.price - a.price);
          setTruth(descPrice);
          break;
        default:
          setTruth(fullArray);
          break;
      }

      switch (nriViewToggle) {
        case 0:
          break;
        case 1:
          let ascNri = [...fullArray].sort((a, b) => a.nri - b.nri);
          setTruth(ascNri);
          break;
        case 2:
          let descNri = [...fullArray].sort((a, b) => b.nri - a.nri);
          setTruth(descNri);
          break;
        default:
          break;
      }
    }
  }, [priceViewToggle, nriViewToggle, fullArray, listedArray]);


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // Check if ESC key is pressed (keyCode 27)
        handleReset();
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("keydown", handleKeyDown);

    // (async () => {
    //   try {
    //     const response = await fetch("./json/layers_static.json");
    //     const jsonData = await response.json();
    //     setLayer(jsonData);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // })();

    // updateShowData2();
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleReset = () => {
    setBackgroundLayer([]);
    setBorderLayer([]);
    setEmblemLayer([]);
    setPhatLayer([]);
    setGlowLayer([]);
    setPriceViewToggle(0);
    setNriViewToggle(0);
    setSearchIndex("");
    setCount(300);

    for (let i = 0; i < LAYERSECTIONS.length; i++) {
      for (let j = 0; j < layer_assets[LAYERSECTIONS[i]]?.length; j++) {
        let actualLayerName = layer_assets[LAYERSECTIONS[i]][j];
        let a = document.getElementById(actualLayerName);
        a.classList.remove("filter-active");
      }
      updateShowData2();
    }
  };


  const handleViewMode = () => {
    if (viewMode == 2) {
      if (count < 300) setCount(Math.min(300, truth.length));
    }
    if (viewMode == 1) {
      if (count < 200) setCount(Math.min(200, truth.length));
    }
  };

  useEffect(() => {
    updateShowData2();
  }, [backgroundLayer, borderLayer, emblemLayer, phatLayer, glowLayer]);

  useEffect(() => {
    updateShowData2();
  }, [loaded]);

  useEffect(() => {
    if (userPhatToggle) {
      setTruth(userPhatArray);
    } else {
      setTruth(fullArray);
    }
  }, [userPhatToggle]);

  // useEffect(() => {
  //   if (searchIndex === "") {
  //     setTruth(fullArray);
  //   } else {
  //     handleSearch(searchIndex);
  //   }
  // }, [searchIndex]);

  // const handleSearch = (n) => {
  //   if (n > 0 && n <= 10000) {
  //     let i = n - 1;
  //     let item = nftArray[i];
  //     setTruth([pushOneItem(item)]);
  //   }
  // };

  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.keyCode === 27) {
  //       // Check if ESC key is pressed (keyCode 27)
  //       handleReset();
  //     }
  //   };

  //   // Add event listener when the component mounts
  //   document.addEventListener("keydown", handleKeyDown);

  //   updateShowData2();
  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);