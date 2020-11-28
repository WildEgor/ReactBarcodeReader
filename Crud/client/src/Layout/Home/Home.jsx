import React, { Component } from "react";
import "./Home.css";
import axios from "axios";
import { PropagateLoader } from 'react-spinners';
// Components
import Student from "../../components/Student/Student";
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
      console.log('First search!')
      const students = await axios("/api/items/");
      this.setState({ data: students.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
  }

  getBarcode = barCode => {
    console.log('Result', barCode.codeResult.code)
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

  searchStudents = async username => {
    let allStudents = [...this.state.data.students];
    let isFound;
    if (this.state.allStudents === null) this.setState({ allStudents });

    let students = this.state.data.students.filter(({ articul }) =>
      (articul.toLowerCase().includes(username.toLowerCase()) && articul.length === username.length)
    );

    console.log(students.length)
    if (students.length > 0) {
      this.setState({ query: username })
      isFound = true
      this.setState({ data: { students } });
    } else {
      isFound = false
    }

    if (username.trim() === "")
      this.setState({ data: { students: this.state.allStudents } });
  
    return isFound
  };

  render(){
    let students

    if (this.state.data)
      students =
        this.state.data.students &&
        this.state.data.students.map(student => (
          <Student key={student._id} {...student} removeStudent={this.removeStudent} />
        ));
    else return <div className="Spinner-Wrapper"> <PropagateLoader color={'#333'} /> </div>;

    if (this.state.error) return <h1>{this.state.error}</h1>;
    if (this.state.data !== null)
      if (!this.state.data.students.length)
        return <h1 className="No-Students">В базе данных отсутствуют записи!</h1>;

    return (
      <div className="Table-Wrapper">
      <GlobalContext.Consumer>
      {({isToggle}) => {
        if (isToggle){
          console.log(isToggle)
          return (
            <Scanner onDetected={this.getBarcode} />
          )
        }
      }}
      </GlobalContext.Consumer>
        <h1>Товар на складе:</h1>
        <div className="Table-Search">
          <SearchStudents searchStudents={this.searchStudents} scannerSearch={this.state.barcode}/>
        </div>
        <table className="Table">
          <thead>
            <tr>
              <th>Артикул</th>
              <th>Краткое описание</th>
              <th>Всего на складе</th>
              <th>Продано</th> 
              <th>Остаток</th> 
              <th>Примечание</th> 
              <th>Удалить / Изменить</th>
            </tr>
          </thead>
          <tbody>{students}</tbody>
        </table>
      </div>
    );
  }
}

export default Home;
