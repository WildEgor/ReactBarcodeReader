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
import TextField from '@material-ui/core/TextField';

import ChangeDialog from '../Dialogs/ChangeDialog'

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 999,
      color: '#fff',
    },
  },
  button: {
    margin: theme.spacing(0.5),
    padding: 'auto'
  },
  progress: {
    position: "absolute"
  }
}));

const AddStudent = props => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false)
  const [itemList, setItemList] = useState([])
  const [isFound, setIsFound] = useState(false)

  const [info, setInfo] = useState({
    articul: "",
    desc: "",
    countAll: 0,
    sold: 0,
    remind: 0,
    notes: "",
    response: ""
  })

  const onChangeHandler = e => {
    let inputValue = e.target.value
    let inputName = e.target.name
    setInfo(oldObject => {
      let newObject = {...oldObject}
      newObject[inputName] = inputValue
      newObject = checkInputs(newObject)
      return newObject
    });
  }

  const checkInputs = formValues => {
    formValues.remind = formValues.countAll - formValues.sold
    if (formValues.remind < 0)
      formValues.remind = 0
    return formValues
  }

  const resetForm = () => {
    setInfo(item => {
      let newItem = {...item}
      for(let prop in newItem){ newItem[prop] = "" }
      return newItem
    }) 
  }

  const addStudent = e => {
    e.preventDefault();
    searchItems('articul').then(
      async (itemList) => {
        setIsFound(false)
        let isExist = itemList.length ? true : false;
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
                autoClose: 3000,
                onClose:  resetForm
              })
          } catch(err) {
            toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
          }
        } else {
            setItemList(itemList)
            console.log('Smt found', itemList)
            setShowDialog(true)
        }
      }
    )
  };

  const quickSearch = name => {
    if (info[name]) {
      searchItems(name).then( itemList => {
        setIsFound(false)
        let isExist = itemList.length ? true : false;
        if (isExist) {
          setItemList(itemList)
          setShowDialog(true)
          console.log('Smt found', itemList)
        } else {
            toast("Такого товара еще нет на складе!" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000, position: "top-center" });
        }
      })
    } else {
      toast("Вы не ввели значение в поле поиска!" ,{ type: toast.TYPE.WARNING, autoClose: 3000, position: "top-center" });
    }
  }

  const searchItems = async query => {
    try {
    setIsFound(true)
    const allStudents = await axios("/api/items/")
    let items = allStudents.data.students.filter(item => {
      if (item[query].toLowerCase() !== info[query].toLowerCase()){
        return false
      }
      return true
    })
    return items
    } catch(err){
      setIsFound(false)
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  }

  useEffect(() => {
    if (typeof props.location.query !== "undefined"){
      setInfo(old => {
        let newObj = {...old}
        newObj.articul = props.location.query
        return newObj
      })
    }
  }, [])

    return (
      <div className='AddStudent-Wrapper'>
        {isFound?
        <Backdrop className={classes.backdrop} open={isFound} >
          <CircularProgress className={classes.progress} />
        </Backdrop>
        : null}
        {showDialog? <ChangeDialog itemsList={itemList} info={info} onShow={setShowDialog} /> : null}
        <h1>Добавить товар:</h1>
        <form onSubmit={addStudent} className="Add-Student-Form">
          <label htmlFor="articul">
          <h4>Артикул:</h4>
          <div className="Add-Student-Input-Search">
          <TextField 
            id="articul"
            name="articul"
            label="Артикул" 
            variant="outlined" 
            className="Add-Student-Input"
            required
            InputProps={{
              inputProps: { 
                value: info.articul,
                minLength: "3", 
                maxLength: "255"
              }
            }}
            onChange={onChangeHandler}
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
          <TextField
            id="desc"
            name="desc"
            label="Категория, название товара и т.д."
            multiline
            rows={4}
            variant="outlined"
            required
            InputProps={{
              inputProps: { 
                value: info.desc,
                minLength: "3", 
                maxLength: "255"
              }
            }}
            onChange={onChangeHandler}
          />
          </label>
          <label htmlFor="countAll">
          <h4>Всего на складе: </h4>
          <TextField 
            id="countAll"
            type="number"
            name="countAll"
            label="0 до 120" 
            variant="outlined" 
            required
            InputProps={{
              inputProps: { 
                value: info.countAll,
                min: info.sold,
                max: 120,
              }
            }}
            onChange={onChangeHandler}
          />
          </label>
          <label htmlFor="sold">
          <h4>Продано: </h4>
          <TextField 
            id="sold"
            type="number"
            name="sold"
            label="0 до 120" 
            variant="outlined" 
            required
            InputProps={{
              inputProps: { 
                value: info.sold,
                min: 0,
                max: info.countAll,
              }
            }}
            onChange={onChangeHandler}
          />
          </label>
          <label htmlFor="remind" >
          <h4>Остаток: </h4>
          <TextField 
            readOnly={true}
            id="remind"
            type="number"
            name="remind"
            label="0 до 120" 
            variant="outlined" 
            required
            InputProps={{
              inputProps: { 
                value: info.remind,
                min: 0,
                max: 120,
              }
            }}
            onChange={onChangeHandler}
          />
          </label>
          <label htmlFor="notes">
          <h4>Примечание: </h4>
          <TextField
            id="notes"
            name="notes"
            label="Добавьте сюда номер штрихкода"
            multiline
            rows={4}
            variant="outlined"
            required
            InputProps={{
              inputProps: { 
                value: info.notes,
                minLength: "3", 
                maxLength: "255"
              }
            }}
            onChange={onChangeHandler}
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