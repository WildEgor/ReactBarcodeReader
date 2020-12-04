import './AddStudent.css';

import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { withRouter } from "react-router-dom";

import ChangeDialog from '../Dialogs/ChangeDialog'

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';

import Formik from '../Forma/Formik'

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

  const quickSearch = name => {
    if (info[name]) {
      searchItems(name).then( itemList => {
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

  const formSchema = {
    fields: {
      articul: {
        type: "text",
        label: "Артикул",
        placeholder: "Артикул",
        options: {
          required: true,
        },
        inputProps: { 
          minLength: "3", 
          maxLength: "255"
        }
      },
      desc: {
        type: "text",
        label: "Краткое описание",
        placeholder: "Краткое описание",
        options: {
          required: true,
          multiline: true, 
          rows: 4
        },
        inputProps: { 
          minLength: "3", 
          maxLength: "255"
        }
      },
      countAll: {
        type: "number",
        label: "Всего на складе",
        placeholder: "0",
        options: {
          required: true,
        },
        inputProps: { 
          min: 0, 
          max: 120
        }
      },
      sold: {
        type: "number",
        label: "Всего продано",
        placeholder: "0",
        options: {
          required: true,
        },
        inputProps: {
          min: 0, 
          max: 120
        }
      },
      remind: {
        type: "number",
        label: "Остаток",
        placeholder: "0",
        options: {
          required: true,
        },
        inputProps: {  
          min: 0, 
          max: 120
        }
      },
      notes: {
        type: "text",
        label: "Примечание",
        placeholder: "Номер штрихкода",
        options: {
          required: true,
          multiline: true, 
          rows: 4
        },
        inputProps: { 
          minLength: "3", 
          maxLength: "255"
        }
      }
    },
    buttons: {
      submit: {
        type: "submit",
        label: "Добавить",
        options: {
          variant: "contained",
          color: "primary",
          size: "small",
          className: classes.button,
          startIcon: <SaveIcon />
        },
      },
      reset: {
        type: "reset",
        label: "Сбросить",
        options: {
          variant: "contained",
          color: "secondary",
          size: "small",
          className: classes.button,
          startIcon: <RotateLeftRoundedIcon />,
        },
      }
    }
  }

    return (
      <div className="AddStudent-Wrapper">
        {isFound?
        <Backdrop className={classes.backdrop} open={isFound} >
          <CircularProgress className={classes.progress} />
        </Backdrop>
        : null}
        {showDialog? <ChangeDialog itemsList={itemList} info={info} onShow={setShowDialog} /> : null}
         <h1>Добавить товар:</h1>
         <Formik formSchema={ formSchema } defValues={ info } onSubmit={ addStudent } updateData={(item) => { 
           setInfo(oldObject => {
                let newObject = {...oldObject}
                newObject[item.name] = item.value
                return newObject
              });
          }} />
        <ToastContainer />
      </div>
      
    );
}

export default withRouter(AddStudent);