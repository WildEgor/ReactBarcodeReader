import React, {useContext, useEffect} from 'react';
import Context from '../../utils/context/Context'
import * as Yup from 'yup';
import { useFormik } from 'formik';

let ValidSchema = Yup.object().shape({
  ['Артикул']: Yup.string().required('Required'),
  ['Описание продукта']: Yup.string().required('Required'),
  ['Количество всего']: Yup.string().required('Required'),
  ['Продали']: Yup.string().required('Required'),
  ['Остаток']: Yup.string().required('Required'),
  ['Примечание']: Yup.string().required('Required'),
});

const ExcelFormik = () => {
  const {excelTable, formString, setFormString} = useContext(Context);

  const formik = useFormik({
    initialValues: {},
    onSubmit: values => {
      setFormString(values);
      console.log('SUBMIT', values);
      //formik.resetForm({});
    },
    enableReinitialize: true
  });

  useEffect(() => {
    console.log('componentDidMount');
    console.log('Valid ', ValidSchema.shape);

    formik.initialValues = _InitFormik(excelTable.columns[0]);

    console.log(ValidSchema);
  
    return () => {
        console.log('componentWillUnmount');
    };
  }, []); // Компонент появляется и исчезает (логика). При первом появлении формы проверяем, если какая таблица открыта

  
  useEffect(() => {

  }, [excelTable.columns[0]]); // При изменении названий колонок вызывается ее рендер 
  
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

  const renderInputs = (tableInfo) => {
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
        { renderInputs(excelTable) }
        <button className="btn-1 btn-1-yellow" type="submit">Добавить</button>  
      </form>
      <button className="btn-1 btn-1-yellow">Изменить</button>
      <button className="btn-1 btn-1-yellow">Удалить</button>
    </React.Fragment>
  );
};

export default ExcelFormik;