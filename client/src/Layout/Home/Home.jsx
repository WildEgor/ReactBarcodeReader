import React, { useState, useEffect, useContext, useCallback } from "react";
import "./Home.css";
import Axios from 'axios'
import { PuffLoader } from 'react-spinners';
// Components
import HomeTable from "../../components/HomeTable/HomeTable"
import SearchBar from "../../components/SearchBar/SearchBar";
import Scanner from '../../components/Scanner/Scanner'
import GlobalContext from '../../Context/GlobalContext';

import axios from "axios";

const Home = props => {
  const globalVar = useContext(GlobalContext)
  const [barcode, setBarcode] = useState("")
  const [allItems, setAllItems] = useState([])
  const [dataItems, setDataItems] = useState([])
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const items = await axios("/api/items/");
        console.log('Items ', items)
        setAllItems(items.data.items)
        setDataItems(items.data.items)
      } catch (err) {
        setErrors(err.message);
      }
    }
    getData()
  }, [])

  useEffect(() => {
    console.log('All', allItems)
  }, [allItems])

  const getBarcode = barCode => {
    setBarcode(barCode.codeResult.code)
  }

  const removeItems = async id => {
    console.log('Try delete...')
    try {
      // refetchDel({
      //   url: `/items/${id}`
      // })
      // refetchGet()
    } catch (err) {
      setErrors( err.message );
    }
  };

  const searchItems = async (username, query) => {
    //let allItems = [...dataGet.items];
    let allItems = [...dataItems]; 
    let isFound = false;
    if (allItems === null) setAllItems(allItems);

    if (allItems.length) {
      var items = allItems.filter(item => {
        return (item[query].toLowerCase().includes(username.toLowerCase()) && item[query].length === username.length)
      }
      );
      setAllItems(items);

      if (items.length) isFound = true
      if (username.trim() === "") setAllItems(allItems);
    } 

    return isFound
  };

  if (isLoading) 
    return <div className="Spinner-Wrapper"><PuffLoader size={"100px"} color={'#333'} /> </div>;
  if (errors) 
    return <h1>{errors}</h1>;
  if (allItems){
    return (
      <div className="Table-Wrapper">
      {globalVar.isToggle && <Scanner onDetected={getBarcode} />}
        <div className="Table-Search">
          <SearchBar searchItems={searchItems} scannerSearch={barcode}/>
        </div>
          <HomeTable table={ allItems } removeItems={ removeItems }/>
      </div>
    );
  }

  return(
    <div className="Table-Wrapper">
    {globalVar.isToggle && <Scanner onDetected={getBarcode} />}
      <div className="Table-Search">
        <SearchBar searchItems={searchItems} scannerSearch={barcode}/>
      </div>
        <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;
    </div>
  ) 
}

export default Home;