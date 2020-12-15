import React, { useState, useEffect, useContext } from "react";
import { PuffLoader } from 'react-spinners';
import axios from "axios";

// Components
import HomeTable from "../../components/HomeTable/HomeTable"
import SearchBar from "../../components/SearchBar/SearchBar";
import Scanner from '../../components/Scanner/Scanner'
import GlobalContext from '../../Context/GlobalContext';

import Container from '@material-ui/core/Container';

const Home = props => {
  const globalVar = useContext(GlobalContext)
  const [barcode, setBarcode] = useState("")
  const [allItems, setAllItems] = useState([])
  const [dataItems, setDataItems] = useState([])
  const [errors, setErrors] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getData = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios("/api/items/");
      setAllItems(data.items)
      setDataItems(data.items)
      setIsLoading(false)
    } catch (err) {
      setErrors(err.message);
      setIsLoading(false)
    }
  }

  useEffect(() => {
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
    setIsLoading(true)
    try {
      const removeItems = await axios.delete(`/api/items/${id}`)
      setIsLoading(false)
    } catch (err) {
      setErrors( err.message );
      setIsLoading(false)
    }
    getData()
  };

  const searchItems = async (username, query) => {
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
    return <Container><PuffLoader size={"100px"} color={'#333'} /> </Container>;
  if (errors) 
    return <h1>{errors}</h1>;
  if (allItems){
    return (
      <Container maxWidth="lg">
      {globalVar.isToggle && <Scanner onDetected={getBarcode} />}
          <SearchBar searchItems={searchItems} scannerSearch={barcode}/>
          <HomeTable table={ allItems } removeItems={ removeItems }/>
      </Container>
    );
  }

  return(
    <Container maxWidth="lg">
    {globalVar.isToggle && <Scanner onDetected={getBarcode} />}
        <SearchBar searchItems={searchItems} scannerSearch={barcode}/>
        <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;
    </Container>
  ) 
}

export default Home;