import React, { useState, useEffect } from "react";
import './AddStudent.css';
import axios from "axios";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { withRouter } from "react-router-dom";

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

  const [forma, setForma] = useState({})

  const onChangeHandler = e => {
    let inputValue = e.target.value
    let inputName = e.target.name
    console.log(inputName)
    setInfo(oldObject => {
      let newObject = {...oldObject}
      newObject[inputName] = inputValue
      newObject = checkInputs(newObject)
      return newObject
    });
  }

  const checkInputs = formValues => {
    
    if (parseInt(formValues.sold) > parseInt(formValues.countAll)){
      formValues.sold = formValues.countAll
    }
    formValues.remind = formValues.countAll - formValues.sold

    forma.formInputs.forEach(item => {
      if (item.name == 'sold')
        item.value = formValues.sold
      if (item.name == 'countAll')
        item.value = formValues.countAll
      if (item.name == 'remind')
        item.value = formValues.countAll - formValues.sold
    })
    return formValues
  }

  const resetForm = () => { 
    forma.formInputs.forEach(
      input => (input.value = "")
    );
    forma.formTextarea.forEach(
      input => (input.value = "")
    );
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
            toast(
              "Товар " + newStudent.data.newStudent.articul + " успешно добавлен" ,
              { type: toast.TYPE.SUCCESS, 
                autoClose: 1000,
                onClose:  resetForm
              })
          } catch(err) {
            //console.log(info.response)
            toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
          }
        } else {
          notify(value)
        }
      }
    )
  };

  const customId = "custom-id-yes";

  const notify = (itemList) => {
    console.log('itemList', itemList)
    toast(<ChangeDialog itemsList={itemList} />, {
      type: toast.TYPE.WARNING,
      toastId: customId,
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
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
        } else {
          if (name !== null){
            toast("Такого товара еще нет на складе!" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000, position: "top-center" });
          }
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

  const getForm = () => {
    const form = document.querySelector('.Add-Student-Form')
    let formInputs = Array.from(form.getElementsByTagName("input"));
    let formTextarea = Array.from(form.getElementsByTagName("textarea"));
    return {formInputs, formTextarea}
  }

  useEffect(() => {
    let { formInputs, formTextarea } = getForm(); 
    setForma({ formInputs, formTextarea })

    if (typeof props.location.query !== "undefined"){
      formInputs[0].value = props.location.query
      setInfo(old => {
        let newObj = {...old}
        newObj.articul = props.location.query
        return newObj
      })
    }
    
    formInputs.filter(item => {
      if (item.name == 'countAll' || item.name == 'sold' || item.name == 'remind'){
        item.value = 0
        setInfo(old => {
          let newObj = {...old}
          newObj[item.name] = 0
          return newObj
        })
        return true
      }
      return false
    })
  }, [])

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
            value={info.articul}
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
            onClick={resetForm}
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

export default withRouter(AddStudent);
