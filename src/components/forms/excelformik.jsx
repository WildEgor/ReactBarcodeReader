import React, {useContext, useEffect} from 'react';
import Context from '../../utils/context/Context'
import { useFormik } from 'formik';

const ExcelFormik = () => {
  const {excelTable, formString, setFormString, lastQuery} = useContext(Context);

  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log('Do query with ...', values);
      if (values.isBtn == 'resetBtn'){
        console.log('Reset form...');
        ProcessQuery(null);
      } else {
        setFormString(values);
      }
    },
    enableReinitialize: true
  });

  // Компонент появляется и исчезает (логика). При первом появлении формы проверяем, если какая таблица открыта
  useEffect(() => {
    console.log('componentDidMount!');
    formik.initialValues = _InitFormik(excelTable.columns[0]);
    return () => {
        console.log('componentWillUnmount!');
        ProcessQuery(null);
    };
  }, []); 

  // После нажатия на кнопку "Поиск" выполнить обработку запроса / по кнопке или событию выполнить "Сброс"
  const ProcessQuery = lastQuery => {
    let newFormArr = []
    let formArr = Array.from(document.querySelectorAll('form'));

    if (lastQuery) {
      console.log('Fill form...', lastQuery);
      for (let prop in lastQuery) {
        newFormArr.push(lastQuery[prop]);
        formik.values[prop] = lastQuery[prop];
      }
      newFormArr.forEach ((item, idx) => {
        formArr[0][idx + 1].value = item;
      })
    } else {
      console.log('Reset form...');
      for (let idx = 0; idx < excelTable.columns[0].length; idx++) {
        formArr[0][idx + 1].value = "";
      }
      formik.resetForm({})
      console.log(formArr[0][0]);
    }
  }

  // Обработка значения, после Поиск от таблицы
  useEffect(() => {
    console.group('Back query: ', lastQuery);
    if ('status' in lastQuery){
      switch (lastQuery['status']){
        case 'no record': 
        ProcessQuery(null);
        alert('Запись не найдена');
          break;
        case 'has record': 
        ProcessQuery(lastQuery);
        alert(JSON.stringify(lastQuery));
          break;
        default: break;
      }
    }
  }, [lastQuery])
  
  // Обновить поля формы
  const _InitFormik = ArrCol => {
    let str = ''; 
    ArrCol.forEach(el => {
      str += `"${el}": "",`;
    })
    str = str.slice(0, -1); 
    str = '{' + str + '}'
    str = JSON.parse(str);
    console.log(str);
    return str;
  };

  // Рендер формы с новыми полями таблицы
  const renderInputs = tableInfo => {
    console.log('Changed heads excelTable', tableInfo);
    const inputs = tableInfo.columns[0].map((value) =>
      {
        return (
          <input name={value} type="text" key={value} placeholder={value} onChange={formik.handleChange} value={formik.values[value]}></input>
        ) 
      }
    );
    return inputs;
  };

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <div style={{display: "flex", flexDirection: "column", width: "50vh"}}>
        <button name="searchBtn" className="btn-1" type="submit" onClick={(e)=>{
            formik.setFieldValue('isBtn', e.target.name)
            formik.handleSubmit(e);
          }}>Поиск</button> 
          { renderInputs(excelTable) }
        </div>
        <div>
          <button name="addBtn" className="btn-1-mod" type="submit" onClick={(e)=>{
              formik.setFieldValue('isBtn', e.target.name)
              formik.handleSubmit(e);
            }}>Добавить</button>
          <button name="changeBtn" className="btn-1-mod" type="submit" onClick={(e)=>{
              formik.setFieldValue('isBtn', e.target.name)
              formik.handleSubmit(e);
            }}>Изменить</button>
          <button name="removeBtn" className="btn-1-mod" type="submit" onClick={(e)=>{
              formik.setFieldValue('isBtn', e.target.name)
              formik.handleSubmit(e);
            }}>Удалить</button>
          <button name="resetBtn" className="btn-1-mod" type="submit" onClick={(e)=>{
              formik.setFieldValue('isBtn', e.target.name)
              formik.handleSubmit(e);
            }}>Сбросить</button>
        </div>
      </form> 
    </React.Fragment>
  );
};

export default ExcelFormik;