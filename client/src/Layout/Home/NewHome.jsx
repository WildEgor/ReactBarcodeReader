import React, { Component, useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { PuffLoader } from 'react-spinners';
// Components
import HomeTable from "../../components/HomeTable/HomeTable"
import SearchStudents from "../../components/SearchStudent/SearchStudents";
import Scanner from '../../components/Scanner/Scanner'
import GlobalContext from '../../Context/GlobalContext';

const Home = props => {
  const [barcode, setBarcode] = useState("")
  const [data, setData] = useState(null)
  const [allStudents, setAllStudents] = useState(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")

  useEffect(() => {
    const componentDidMount = async () =>{
      try {
        const students = await axios("/api/items/");
        // setQueryInfo(ob => {
        //   let no = {...ob}
        //   no.data = students.data
        //   return no
        // })
        setData({ data: students.data })
        //this.searchStudents("", 'articul')
      } catch (err) {
        // setQueryInfo(ob => {
        //     const no = {...ob}
        //     no.error = err.message
        //     return no
        // })
        setError({ error: err.message });
      }
    }
    componentDidMount()
  })

  const getBarcode = barCode => {
    // setQueryInfo(ob => {
    //     const no = {...ob}
    //     no.barcode = barCode.codeResult.code
    //     return no
    // })
    setBarcode({barcode: barCode.codeResult.code})
  }

  const removeStudent = async id => {
    console.log('Try delete...')
    try {
      const studentRemoved = await axios.delete(`/api/items/${id}`);
      const students = await axios("/api/items/");
    //   setQueryInfo(ob => {
    //     const no = {...ob}
    //     no.data = students.data
    //     return no
    //   })
        setData({ data: students.data });
    } catch (err) {
    //   setQueryInfo(ob => {
    //     const no = {...ob}
    //     no.error = err.message
    //     return no
    //   })
        setError({ error: err.message });
    }
  };

  const searchStudents = async (username, query) => {
    //console.log('Old query is ', query)
    console.log('New query is ', username)
    let allStudents = [...data.students];
    let isFound = false;
    if (allStudents === null) {
    //   setQueryInfo(ob => {
    //     let no = {...ob}
    //     no = { allStudents }
    //     return no
    //   })
        setAllStudents({ allStudents })
    } 

    let students = data.students.filter(item => {
      return (item[query].toLowerCase().includes(username.toLowerCase()) && item[query].length === username.length)
    }
    );

    if (students.length > 0) {
      isFound = true
    //   setQueryInfo(ob => {
    //     let no = {...ob}
    //     no.data = { students }
    //     return no
    //   })
        setData({ data: { students } });
    } else {
      isFound = false
    }

    if (username.trim() === ""){
    //   setQueryInfo(ob => {
    //     let no = {...ob}
    //     no.data = { students: queryInfo.allStudents }
    //     return no
    //   })
        setData({ data: { students: allStudents } });
      return isFound
    }
    // setQueryInfo(ob => {
    //   let no = {...ob}
    //   no.query = username
    //   return no
    // })
    return isFound
  };

  if (!data)
    return <div className="Spinner-Wrapper"> <PuffLoader size={"100"} color={'#333'} /> </div>;
  if (error) {
    return <h1>{error}</h1>;
  } else {
    if (!data.students.length) return <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;
  } 
  return(
    <div className="Table-Wrapper">
       <GlobalContext.Consumer>
         {({isToggle}) => { if (isToggle) return ( <Scanner onDetected={getBarcode} /> ) }}
       </GlobalContext.Consumer>
         <div className="Table-Search">
           <SearchStudents searchStudents={ searchStudents } scannerSearch={barcode}/>
         </div>
         <HomeTable table={ data.students } removeItem={ removeStudent }/>
       </div>
  )
  }

export default Home;
