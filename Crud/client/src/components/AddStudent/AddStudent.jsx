import React, { Component } from "react";
import './AddStudent.css';
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AddStudent extends Component {
  state = {
    articul: "",
    desc: "",
    countAll: "",
    sold: "",
    remind: "",
    notes: "",
    response: ""
  };

  onChangeHandler = e => this.setState({ [e.target.name]: e.target.value });

  addStudent = async e => {
    e.preventDefault();
    try {
      const newStudent = await axios.post("/api/items", {
            articul: this.state.articul,
            desc: this.state.desc,
            countAll: this.state.countAll,
            sold: this.state.sold,
            remind: this.state.remind,
            notes: this.state.notes
        }
      );

      toast("Товар " + newStudent.data.newStudent.name + " успешно добавлен" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000 });
    } catch (err) {
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  };

  render() {
    return (
      <div className="AddStudent-Wrapper">
        <h1>Добавить товар:</h1>
        <form onSubmit={this.addStudent}>
          <label htmlFor="articul">Артикул:</label>
          <input
            type="text"
            placeholder="Артикул..."
            name="articul"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="33"
            id="articul"
          />
          <label htmlFor="desc">Краткое описание:</label>
          <input
            type="text"
            placeholder="Описание товара..."
            name="desc"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="33"
            id="desc"
          />
          <label htmlFor="countAll">Всего на складе: </label>
          <input
            type="number"
            placeholder="0 до 120"
            name="countAll"
            min="1"
            max="120"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            id="countAll"
          />
          <label htmlFor="sold">Продано: </label>
          <input
            type="number"
            placeholder="0 до 120"
            name="sold"
            min="1"
            max="120"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            id="sold"
          />
          <label htmlFor="remind">Остаток: </label>
          <input
            type="number"
            placeholder="0 от 120"
            name="remind"
            min="1"
            max="120"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            id="remind"
          />
          <label htmlFor="notes">Примечание:</label>
          <input
            type="text"
            placeholder="Примечание к товару..."
            name="notes"
            onChange={this.onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="33"
            id="notes"
          />
          <button type="submit" className="Add-Student-Submit fa fa-plus"></button>
          <button type="reset" className="Add-Student-Reset fa fa-refresh"></button>
        </form>
        <ToastContainer />
      </div>
    );
  }
}

export default AddStudent;
