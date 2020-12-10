import React, { useEffect, useState } from "react";
import './EditStudent.css';
import axios from "axios";
import { withRouter } from 'react-router'
import {toast, ToastContainer} from "react-toastify";

import AutoForma from '../Forma/AutoForma';

import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';

import { schema, uiSchema} from '../TableSchema/TableSchema'

const useStyles = makeStyles((theme) => ({
  buttonAdd: {
    margin: theme.spacing(1),
    padding: 'auto',
    backgroundColor: "rgba(78,163,61, 1.0)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(78,163,61, 0.6)"
    },
  },
  buttonReset: {
    display: "none",
    margin: theme.spacing(1),
    padding: 'auto',
    backgroundColor: "rgba(190,98,61, 1.0)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(190,98,61, 0.6)"
    }
  },
}));

const EditStudent = props => {
  const classes = useStyles();
  const [info, setInfo] = useState({
    id: '',
    articul: "",
    desc: "",
    countAll: "",
    sold: "",
    remind: "",
    notes: "",
    response: ""
  })

  const [formUpdate, setFormUpdate] = useState()

  const firstSearch = async () => {
    try {
      let search =  props.location.search,
      id = search.substring(1, search.length);
      const updateStudent = await axios(`/api/items/${id}`);
      const { articul, desc, countAll, sold, remind, notes } = updateStudent.data.student;
      setInfo({ id, articul, desc, countAll, sold, remind, notes  });
      renderForm({ id, articul, desc, countAll, sold, remind, notes  })
      return { id, articul, desc, countAll, sold, remind, notes  }
      } catch (err) {
        setInfo({ response: "Товар не найден!" })
      }
  }

  useEffect(() => {
    firstSearch()
  }, [])

  const autoComplete = formData => {
    formData.remind = formData.countAll - formData.sold
    return formData
  }

  const renderForm = (formInitData) => {
    setFormUpdate (
      <AutoForma 
          schema={ schema } 
          formInitData={ formInitData } 
          uiSchema={ {...uiSchema, "ui:title": "Изменить товар"} } 
          // addFunc = { formdata => {return formdata}}
          addFunc = { autoComplete }
          onSubmitData={ updateStudentHandler } 
          validateFunc={ validate }
          mUIClasses={ classes }
      />
    )
  }

  const updateStudentHandler = async (e, data) => {
    e.preventDefault();
    try {
      const student = await axios.put(`/api/items/${data.id}`, {
          articul: data.articul,
          desc: data.desc,
          countAll: data.countAll,
          sold: data.sold,
          remind: data.remind,
          notes: data.notes
      });
      toast(student.data.message ,{ type: toast.TYPE.INFO, autoClose: 3000 });

    } catch (err) {
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  };

  const validate = (formData, errors) => {
    if (formData.countAll < formData.sold) 
        errors.countAll.addError("Ошибка при вводе значений");
    return errors;
  }

  return (
        // (info.response === "Товар не найден!")? <h1>Товар не найден!</h1> :
      <div className="Edit-Student-Wrapper">
        { !formUpdate? <CircularProgress /> : null}
        { formUpdate }
        <ToastContainer />
      </div>
  )
}

export default withRouter(EditStudent);
