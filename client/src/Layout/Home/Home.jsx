import React, { Component } from "react";
import "./Home.css";
import axios from "axios";
import { PuffLoader } from 'react-spinners';
// Components
import HomeTable from "../../components/HomeTable/HomeTable"
import SearchStudents from "../../components/SearchStudent/SearchStudents";
import Scanner from '../../components/Scanner/Scanner'
import GlobalContext from '../../Context/GlobalContext';

class Home extends Component {
  state = {
    barcode: "",
    data: null,
    allStudents: null,
    error: "",
    query: ""
  };

  async componentDidMount() {
    try {
      const students = await axios("/api/items/");
      this.setState({ data: students.data })
      this.searchStudents("", 'articul')
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  getBarcode = barCode => {
    this.setState({barcode: barCode.codeResult.code})
  }
  
  removeStudent = async id => {
    console.log('Try delete...')
    try {
      const studentRemoved = await axios.delete(`/api/items/${id}`);
      const students = await axios("/api/items/");
      this.setState({ data: students.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  searchStudents = async (username, query) => {
    
    let allStudents = [...this.state.data.students];
    let isFound = false;
    if (this.state.allStudents === null) this.setState({ allStudents });

    let students = this.state.data.students.filter(item => {
      return (item[query].toLowerCase().includes(username.toLowerCase()) && item[query].length === username.length)
    } 
    );

    if (students.length > 0) {
      isFound = true
      this.setState({ data: { students } });
    } else {
      isFound = false
    }

    if (username.trim() === ""){
      this.setState({ data: { students: this.state.allStudents } });
      return isFound
    }
  
    return isFound
  };

  render(){
    if (!this.state.data)
      return <div className="Spinner-Wrapper"> <PuffLoader size={"100"} color={'#333'} /> </div>;

    if (this.state.error) return <h1>{this.state.error}</h1>;
      if (!this.state.data.students.length)
        return <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;

    return (
      <div className="Table-Wrapper">
      <GlobalContext.Consumer>
        {({isToggle}) => { if (isToggle) return ( <Scanner onDetected={this.getBarcode} /> ) }}
      </GlobalContext.Consumer>
        <div className="Table-Search">
          <SearchStudents searchStudents={this.searchStudents} scannerSearch={this.state.barcode}/>
        </div>
        <HomeTable table={ this.state.data.students } removeItem={ this.removeStudent }/>
      </div>
    );
  }
}

export default Home;
