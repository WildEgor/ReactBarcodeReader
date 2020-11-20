import React, {useContext, useEffect} from 'react';
import Context from '../../utils/context/Context'
import { useFormik } from 'formik';

const ExcelFormik = () => {
  const {excelTable, query, setQuery, callback, setCallBack} = useContext(Context);

  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {
      let isBtn = values.isBtn
      delete values.isBtn
      console.group('Do query with ... (onSubmit)', values)
      if (isBtn == 'resetBtn'){
        console.log('Reset form... (onSubmit)')
      } else {
          console.log('Query in process... (onSubmit)')
          setQuery(oldQuery => {
            let newQuery = {...oldQuery}
            newQuery.str = values 
            newQuery.type = isBtn
            return newQuery
          })
      }
    },
    enableReinitialize: true
  });

  const ResetForm = () => {
    let formArr = Array.from(document.querySelectorAll('form'));
    console.group('ResetForm')
    console.log('Forma', formArr)
    //formik.resetForm({})
  }

  // При первом появлении формы проверяем, если какая таблица открыта. При закрытии очищаем форму
  useEffect(() => {
    console.log('componentDidMount!');
    formik.initialValues = _InitFormik(excelTable.columns);
    return () => {
        console.log('componentWillUnmount!');
    };
  }, []); 

  // Обработка callback
  useEffect(() => {
    if (callback.status.cod){
      console.group('...Callback...')
      console.log(callback)

      setCallBack(old => {
        let newCallback = {...old}
        newCallback.records = []
        newCallback.status.cod = null
        newCallback.status.isLoading = false
        return newCallback
      })

      setQuery(oldQuery => {
        let newQuery = {...oldQuery}
        newQuery.str = {} 
        newQuery.type = ''
        return newQuery
      })
    }
  }, [callback.status.cod])
  
  // Обновить поля формы
  const _InitFormik = arrCol => {
    let str = ''; 
    arrCol.forEach(el => {
      str += `"${el}": "",`;
    })
    str = str.slice(0, -1); 
    str = '{' + str + '}'
    str = JSON.parse(str);
    return str;
  };

  // Рендер формы с новыми полями таблицы
  const renderInputs = tableInfo => {
    const inputs = tableInfo.columns.map((value) =>
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
          {callback.status.isLoading? <div>Loading...</div>: null}
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