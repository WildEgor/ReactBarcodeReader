import React, { useEffect, useState } from "react";
import './EditStudent.css';
import axios from "axios";
import { withRouter } from 'react-router'
import {toast, ToastContainer} from "react-toastify";

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0.5),
    padding: 'auto',
    backgroundColor: "orange",
    color: "black"
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
  const [oldInfo, setOldInfo] = useState({
    id: '',
    articul: "",
    desc: "",
    countAll: "",
    sold: "",
    remind: "",
    notes: "",
  })
  const [forma, setForma] = useState()

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

  const getForm = () => {
    const form = document.querySelector('.Edit-Student-Form')
    let formInputs = Array.from(form.getElementsByTagName("input"));
    let formTextarea = Array.from(form.getElementsByTagName("textarea"));
    return {formInputs, formTextarea}
  }

  useEffect(() => {
    let { formInputs, formTextarea } = getForm(); 
    setForma({ formInputs, formTextarea })

    async function firstSearch() {
      try {
        let search =  props.location.search,
        id = search.substring(1, search.length);
        const updateStudent = await axios(`/api/items/${id}`);
        const { articul, desc, countAll, sold, remind, notes } = updateStudent.data.student;
        setInfo({ id, articul, desc, countAll, sold, remind, notes  });
        setOldInfo({ id, articul, desc, countAll, sold, remind, notes  });
        } catch (err) {
          setInfo({ response: "Товар не найден!" })
        }
    }
    firstSearch();
  }, [])

  const updateStudentHandler = async (e) => {
    e.preventDefault();
    try {
      const student = await axios.put(`/api/items/${info.id}`, {
          articul: info.articul,
          desc: info.desc,
          countAll: info.countAll,
          sold: info.sold,
          remind: info.remind,
          notes: info.notes
      });
      toast(student.data.message ,{ type: toast.TYPE.INFO, autoClose: 3000 });

    } catch (err) {
      toast(err.message ,{ type: toast.TYPE.ERROR, autoClose: 3000 });
    }
  };

  return (
        // (info.response === "Товар не найден!")? <h1>Товар не найден!</h1> :
      <div className="Edit-Student-Wrapper">
        <h1>Изменить товар</h1>
          <form onSubmit={this.updateStudentHandler} className="Edit-Student-Form">
          <label htmlFor="articul">
          <h4>Артикул:</h4>
          <input
            type="text"
            placeholder="Артикул..."
            value={ info.articul }
            name="articul"
            onChange={onChangeHandler}
            required
            className="Edit-Student-Input"
            id="articul"
          />
          </label>
          <label htmlFor="desc" style={{display: "flex", flexDirection: "column"}}>
          <h4>Краткое описание:</h4>
          <textarea
            style={{resize: "vertical"}}
            placeholder="Описание товара..."
            value={ info.desc }
            name="desc"
            onChange={onChangeHandler}
            required
            minLength="3"
            maxLength="255"
            className="Edit-Student-Input"
            id="desc"
          />
          </label>
          <label htmlFor="countAll"> 
          <h4>Всего на складе:</h4>
          <input
            type="number"
            placeholder="0 до 120"
            value={ info.countAll }
            name="countAll"
            min="0"
            max="120"
            required
            onChange={onChangeHandler}
            className="Edit-Student-Input"
            id="countAll"
          />
          </label>
          <label htmlFor="sold">
          <h4>Продано:</h4> 
          <input
            type="number"
            placeholder="0 до 120"
            value={ info.sold }
            name="sold"
            min="0"
            max="120"
            required
            onChange={onChangeHandler}
            className="Edit-Student-Input"
            id="sold"
          />
          </label>
          <label htmlFor="remind">
          <h4>Остаток:</h4> 
          <input
            type="number"
            placeholder="0 до 120"
            value={ info.remind }
            name="remind"
            min="0"
            max="120"
            required
            onChange={onChangeHandler}
            className="Edit-Student-Input"
            id="remind"
          />
          </label>
          <label htmlFor="notes" style={{display: "flex", flexDirection: "column"}}>
          <h4>Примечание:</h4>
          <textarea
            style={{resize: "vertical"}}
            placeholder="Примечание к товару..."
            value={ info.notes }
            name="notes"
            onChange={onChangeHandler}
            required
            className="Edit-Student-Input"
            id="notes"
          />
          </label>
          <div className="Edit-Student-Form-Buttons">
            <Button
                onClick={updateStudentHandler}
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Обновить
              </Button>
            </div>
        </form>
        <ToastContainer />
      </div>
  )
}

export default withRouter(EditStudent);
