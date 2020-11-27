import React, { useState } from "react";
import './AddStudent.css';
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded';
import { makeStyles } from '@material-ui/core/styles';

import ChangeDialog from '../Dialogs/ChangeDialog'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const AddStudent = props => {
  const classes = useStyles();

  const [info, setInfo] = useState({
    articul: "",
    desc: "",
    countAll: "",
    sold: "",
    remind: "",
    notes: "",
    response: ""
  })

  const onChangeHandler = e => {
    let inputValue = e.target.value
    let inputName = e.target.name
    setInfo(oldObject => {
      let newObject = {...oldObject}
      newObject[inputName] = inputValue
      return newObject
    });
  }

  const addStudent = e => {
    e.preventDefault();
    searchItems('articul').then(
      async (value) => {
        console.log('isExist', value)
        let isExist = value.length ? true : false;
        console.log('isExist', isExist)
        if (!isExist){
          try {
            let newStudent = await axios.post("/api/items", {
              articul: info.articul,
              desc: info.desc,
              countAll: info.countAll,
              sold: info.sold,
              remind: info.remind,
              notes: info.notes
            })
            toast("Товар " + newStudent.data.newStudent.articul + " успешно добавлен" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000 });
          } catch(err) {
            toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
          }
        } else {
          notify(value)
          //toast("Товар уже существует!" ,{ position: "top-left", type: toast.TYPE.ERROR, autoClose: 3000 });
        }
      }
    )
  };

  const customId = "custom-id-yes";

  const notify = (itemList) => {
    console.log('itemList', itemList)
    toast(<ChangeDialog itemsList={itemList} />, {
      toastId: customId,
      position: "top-left",
      autoClose: 3000,
      autoClose: true,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: true
    }) 
  }

  const quickSearch = name => {
    let searchQuery = info[name]
    if (searchQuery) {
      searchItems(name).then( value => {
        let itemList = value
        const itemsCount = value.length
        let isExist = itemsCount ? true : false
        if (isExist) {
          notify(itemList)
          //toast(`Товар уже существует! Найдено ${itemsCount} запись(-ей).` ,{ type: toast.TYPE.WARNING, autoClose: 3000, position: "top-center" });
        } else {
          toast("Такого товара еще нет на складе!" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000, position: "top-center" });
        }
      })
    }
  }

  const searchItems = async query => {
    console.log(query)
    try {
    const allStudents = await axios("/api/items/")

    let items = allStudents.data.students.filter(item => {
      if (item[query].toLowerCase() !== info[query].toLowerCase()){
        return false
      }
      return true
    })
    return items
    } catch(err){
    toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  }

    return (
      <div className='AddStudent-Wrapper'>
        <h1>Добавить товар:</h1>
        <form onSubmit={addStudent} className="Add-Student-Form">
          <label htmlFor="articul">
          <h4>Артикул:</h4>
          <div className="Add-Student-Input-Search">
          <input
            type="text"
            placeholder="Артикул..."
            name="articul"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="255"
            id="articul"
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {quickSearch('articul')}}
            className={classes.button}
            startIcon={<SearchIcon />}
          >
          </Button>
          </div>
          </label>
          <label htmlFor="desc">
          <h4>Краткое описание:</h4>
          <textarea
            placeholder="Описание товара..."
            name="desc"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="255"
            id="desc"
          />
          </label>
          <label htmlFor="countAll">
          <h4>Всего на складе: </h4>
          <input
            type="number"
            placeholder="0 до 120"
            name="countAll"
            min="0"
            max="120"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            id="countAll"
          />
          </label>
          <label htmlFor="sold">
          <h4>Продано: </h4>
          <input
            type="number"
            placeholder="0 до 120"
            name="sold"
            min="0"
            max="120"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            id="sold"
          />
          </label>
          <label htmlFor="remind" >
          <h4>Остаток: </h4>
          <input
            type="number"
            placeholder="0 от 120"
            name="remind"
            min="0"
            max="120"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            id="remind"
          />
          </label>
          <label htmlFor="notes">
          <h4>Примечание: </h4>
          <textarea
            placeholder="Примечание к товару..."
            name="notes"
            onChange={onChangeHandler}
            className="Add-Student-Input"
            required
            minLength="3"
            maxLength="255"
            id="notes"
          />
          </label>
          <div className="Add-Student-Form-Buttons">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<SaveIcon />}
            >
              Добавить
            </Button>
            <Button
            type="reset"
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<RotateLeftRoundedIcon />}
            >
            Сбросить
            </Button>
          </div>
        </form>
        <ToastContainer />
      </div>
    );
}

export default AddStudent;
