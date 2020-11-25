import React, { Component } from "react";
import './EditStudent.css';
import axios from "axios";
import { withRouter } from 'react-router'
import {toast, ToastContainer} from "react-toastify";

class EditStudent extends Component {
  state = {
    id: '',
    articul: "",
    desc: "",
    countAll: "",
    sold: "",
    remind: "",
    notes: "",
    response: ""
  };

  onChangeHandler = e => this.setState({ [e.target.name]: e.target.value });

  async componentDidMount() {
    try {
    let search =  this.props.location.search,
      id = search.substring(1, search.length);
    const updateStudent = await axios(`/api/items/${id}`);
    const { articul, desc, countAll, sold, remind, notes } = updateStudent.data.student;
    this.setState({ id, articul, desc, countAll, sold, remind, notes  });
    } catch (err) {
      this.setState({ response: "Товар не найден!" })
    }
  };

  updateStudentHandler = async (e) => {
    e.preventDefault();
    try {
      const student = await axios.put(`/api/items/${this.state.id}`, {
          articul: this.state.articul,
          desc: this.state.desc,
          countAll: this.state.countAll,
          sold: this.state.sold,
          remind: this.state.remind,
          notes: this.state.notes
      });
      toast(student.data.message ,{ type: toast.TYPE.INFO, autoClose: 3000 });

    } catch (err) {
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  };

  render() {
    if (this.state.response === "Товар не найден!")
      return <h1>Товар не найден!</h1>
    return (
      <div className="Edit-Student-Wrapper">
        <h1>Изменить товар</h1>
          <form onSubmit={this.updateStudentHandler}>
          <label htmlFor="articul">Артикул:</label>
          <input
            type="text"
            placeholder="Артикул..."
            value={ this.state.articul }
            name="articul"
            onChange={this.onChangeHandler}
            required
            className="Edit-Student-Input"
            id="articul"
          />
          <label htmlFor="desc">Краткое описание:</label>
          <input
            type="text"
            placeholder="Описание товара..."
            value={ this.state.desc }
            name="desc"
            onChange={this.onChangeHandler}
            required
            className="Edit-Student-Input"
            id="desc"
          />
          <label htmlFor="countAll">Всего на складе: </label>
          <input
            type="number"
            placeholder="1 до 120"
            value={ this.state.countAll }
            name="countAll"
            min="1"
            max="120"
            required
            onChange={this.onChangeHandler}
            className="Edit-Student-Input"
            id="countAll"
          />
          <label htmlFor="sold">Продано: </label>
          <input
            type="number"
            placeholder="1 до 120"
            value={ this.state.sold }
            name="sold"
            min="1"
            max="120"
            required
            onChange={this.onChangeHandler}
            className="Edit-Student-Input"
            id="sold"
          />
          <label htmlFor="remind">Остаток: </label>
          <input
            type="number"
            placeholder="1 до 120"
            value={ this.state.remind }
            name="remind"
            min="1"
            max="120"
            required
            onChange={this.onChangeHandler}
            className="Edit-Student-Input"
            id="remind"
          />
          <label htmlFor="notes">Примечание:</label>
          <input
            type="text"
            placeholder="Примечание к товару..."
            value={ this.state.notes }
            name="notes"
            onChange={this.onChangeHandler}
            required
            className="Edit-Student-Input"
            id="notes"
          />
          <button type="submit" className="Edit-Student-Submit fa fa-pencil"></button>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default withRouter(EditStudent);
