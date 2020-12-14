import React, { Component } from "react";
import "./Home.css";
import axios from "axios";
import { PuffLoader } from 'react-spinners';
// Components
import HomeTable from "../../components/HomeTable/HomeTable"
import SearchBar from "../../components/SearchBar/SearchBar";
import Scanner from '../../components/Scanner/Scanner'
import GlobalContext from '../../Context/GlobalContext';

class Home extends Component {
  state = {
    barcode: "",
    data: null,
    allItems: null,
    error: "",
    query: ""
  };

  async componentDidMount() {
    try {
      const items = await axios("/api/items/");
      this.setState({ data: items.data })
      this.searchItems("", 'articul')
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  getBarcode = barCode => {
    this.setState({barcode: barCode.codeResult.code})
  }
  
  removeItems = async id => {
    console.log('Try delete...')
    try {
      const itemRemoved = await axios.delete(`/api/items/${id}`);
      const items = await axios("/api/items/");
      this.setState({ data: items.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  searchItems = async (username, query) => {
    
    let allItems = [...this.state.data.items];
    let isFound = false;
    if (this.state.allItems === null) this.setState({ allItems });

    let items = this.state.data.items.filter(item => {
      return (item[query].toLowerCase().includes(username.toLowerCase()) && item[query].length === username.length)
    } 
    );

    if (items.length > 0) {
      isFound = true
      this.setState({ data: { items } });
    } else {
      isFound = false
    }

    if (username.trim() === ""){
      this.setState({ data: { items: this.state.allItems } });
      return isFound
    }
  
    return isFound
  };

  render(){
    if (!this.state.data)
      return <div className="Spinner-Wrapper"> <PuffLoader size={"100px"} color={'#333'} /> </div>;

    if (this.state.error) return <h1>{this.state.error}</h1>;
      if (!this.state.data.items.length)
        return <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;

    return (
      <div className="Table-Wrapper">
      <GlobalContext.Consumer>
        {({isToggle}) => { if (isToggle) return ( <Scanner onDetected={this.getBarcode} /> ) }}
      </GlobalContext.Consumer>
        <div className="Table-Search">
          <SearchBar searchItems={this.searchItems} scannerSearch={this.state.barcode}/>
        </div>
        <HomeTable table={ this.state.data.items } removeItems={ this.removeItems }/>
      </div>
    );
  }
}

export default Home;