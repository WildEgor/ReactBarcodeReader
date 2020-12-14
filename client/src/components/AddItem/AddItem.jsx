import './AddItem.css';

import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { withRouter } from "react-router-dom";

import ChangeDialog from '../Dialogs/ChangeDialog'

import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import AutoForma from '../Forma/AutoForma';
import { schema, uiSchema} from '../TableSchema/TableSchema'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    backdrop: {
      zIndex: theme.zIndex.drawer,
      color: '#fff',
    },
  },
  button: {
    margin: theme.spacing(1),
    padding: 'auto'
  },
  progress: {
    position: "absolute"
  },
  buttonAdd: {
    margin: theme.spacing(1),
    padding: 'auto',
    backgroundColor: "rgba(78,163,61, 1.0)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(78,163,61, 0.6)"
    }
  },
  buttonReset: {
    margin: theme.spacing(1),
    padding: 'auto',
    backgroundColor: "rgba(190,98,61, 1.0)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(190,98,61, 0.6)"
    }
  },
}));

const AddItem = props => {
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false)
  const [itemList, setItemList] = useState([])
  const [isFound, setIsFound] = useState(false)

  const addItem = (e, data) => {
    e.preventDefault();
    searchItems('articul', data).then(
      async (itemList) => {
        setIsFound(false)
        let isExist = itemList.length ? true : false;
        if (!isExist){
          try {
            let newItem = await axios.post("/api/items", {
              articul: data.articul,
              desc: data.desc,
              countAll: data.countAll,
              sold: data.sold,
              remind: data.remind,
              notes: data.notes
            })
            toast(
              "Товар " + newItem.data.newItem.articul + " успешно добавлен" ,
              { type: toast.TYPE.SUCCESS, 
                autoClose: 3000,
                //onClose:  resetForm
              })
          } catch(err) {
            toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
          }
        } else {
            setItemList(itemList)
            setShowDialog(true)
        }
      }
    )
  };

  const quickSearch = (name, e, data) => {
    if (data[name]) {
      searchItems(name, data).then( itemList => {
        setIsFound(false)
        let isExist = itemList.length ? true : false;
        if (isExist) {
          setItemList(itemList)
          setShowDialog(true)
        } else {
            toast("Такого товара еще нет на складе!" ,{ type: toast.TYPE.SUCCESS, autoClose: 3000, position: "top-center" });
        }
      })
    } else {
      toast("Вы не ввели значение в поле поиска!" ,{ type: toast.TYPE.WARNING, autoClose: 3000, position: "top-center" });
    }
  }

  const searchItems = async (query, data) => {
    console.log('Search data', query, data)
    try {
    setIsFound(true)
    const allItems = await axios("/api/items/")
    let items = allItems.data.items.filter(item => {
      if (item[query].toLowerCase() !== data[query].toLowerCase())
        return false
      return true
    })
    return items
    } catch(err){
      setIsFound(false)
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  }

    return (
      <div className="AddStudent-Wrapper">
        {isFound?
        <Backdrop className={classes.backdrop} open={isFound} >
          <CircularProgress className={classes.progress} />
        </Backdrop>
        : null}
        {showDialog? <ChangeDialog itemsList={itemList} onShow={setShowDialog} /> : null}
          <AutoForma 
          schema={ schema } 
          formInitData={ () => {
            const no = {}
            if (props.location.query)
              no[props.location.query.type] = props.location.query.value
            return no
          } } 
          uiSchema={ {...uiSchema, "ui:title": "Добавить товар"} } 
          onSubmitData={ addItem } 
          addFunc={ (formData) => {
            if (formData.countAll < formData.sold)
              formData.sold = formData.countAll
            formData.remind = formData.countAll - formData.sold
              return formData
          } } 
          quickSearchFunc={ quickSearch }
          validateFunc={ (formData, errors) => {
            if (formData.countAll < formData.sold) 
              errors.countAll.addError("Ошибка при вводе значений");
            return errors;
          }}
          mUIClasses={ classes }
          />
        <ToastContainer />
      </div>
      
    );
}

export default withRouter(AddItem);