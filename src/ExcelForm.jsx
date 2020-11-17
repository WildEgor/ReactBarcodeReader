import React, { useEffect, useState } from 'react'
import Context from './Context'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
import XLSX from 'xlsx';
import ChangeForm from './ChangeForm'

const ExcelForm = () => {
    const [initialData, setInitialData] = useState() // При загрузке таблицы получаем начальные данные
    const [currentSheet, setCurrentSheet] = useState({}) // Храним текущее состояние таблицы
    const [excelTable, setExcelTable] = useState({}); // Храним основные данные о таблице (название текущего листа, заголовки)
    const [JSONTable, setJSONTable] = useState({}) // Храним текущее состояние таблицы в формате json
    const [isForm, setIsForm] = useState(false);
    const [formString, setFormString] = useState({})

    const handleUpload = event => { // Функция чтения файла с таблицей .xlsx
      const file = event.target.files[0];
      readFile(file)
        .then((readedData) => {
          setInitialData(readedData);
          console.log('Initial Data', initialData);
        })
        .catch((error) => console.error(error));
    };

    const openForm = () => {
      setIsForm(!isForm);
    }

    const save = event => { // Функция сохраниения данных в формат JSON и перезапись текущего файла (Только по кнопке...)

      console.log('SAVED!');
      
      if (Object.keys(currentSheet).length !== 0 && currentSheet.constructor === Object) {
      console.log(currentSheet);
      const result = generateObjects(currentSheet); // создаем объект JSON из файла .xlsx

      setJSONTable(JSON.stringify(result, null, ' ')); // записываем текущее состояние как JSON
     
        if (typeof JSONTable !== "undefined" && (event.target && event.target.name == "saveBtn")) { // при нажатии кнопки сохраняем 
          console.log('SAVE JSON TO TABLE...'); 
          
          let newWB = XLSX.utils.book_new();
          let newWS = XLSX.utils.json_to_sheet(result);
          console.log(excelTable.name);
          XLSX.utils.book_append_sheet(newWB, newWS, excelTable.name);
          XLSX.writeFile(newWB, "data.xlsx");
        }  
      }
    };

    function POSTLocal(opts, nameTable) { // Тест работы с файлом json

      var headers = new Headers();
      
      headers.append('Content-Type', 'application/json');

      var options = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        body:  JSON.stringify(opts)
    };

    fetch('http://localhost:8081/table') // Запросить текущий файл JSON
      .then(response => response.json())
      .catch(error => console.error('Error:', error))
      .then(response => console.log('Success:', JSON.stringify(response)));

    var request = new Request('http://localhost:8081/table', options); // Обновить JSON
    fetch(request).then(function(response) {

    console.log("Success");
        return response;
    }).then(function(json) {
    console.log(json.errors);
    }).catch(function(err) {
    console.log("Error " + err);
    })
  }

    const changeInfoTable = cs => { // Изменение имени таблицы, заголовков

      for (let prop of Object.entries(cs)){
        setExcelTable(oldObject => {
          const newObject = { ...oldObject };
          newObject.name = prop[0];
          return newObject;
        });
      }

      let arr = [];
      for (let prop in cs){
        arr.push(cs[prop][0]);
      }
      setExcelTable(oldObject => {
        const newObject = { ...oldObject };
        newObject.columns = arr;
        return newObject;
      });

      console.log('excelTable: ', excelTable);
    };

    const changerBtn = () => {
      // Тестовая строка 
      const testString = formString;

      const oldObj = [...JSONTable]; // Получить данные JSON

      oldObj.push(testString);
      
      setJSONTable(oldObject => {
        let newObject = { ...oldObject };
        newObject = [...oldObj];
        return newObject;
      });

      console.log(JSONTable);

      let bufArr = {[excelTable.name]: JSONTable}

      POSTLocal(bufArr, excelTable.name);
    }
    
    return (
      <Context.Provider value={{excelTable, formString, setFormString}}>
        <>
        <div style={{display: "flex"}}>
          <input
            className="btn-1-mod btn-1-yellow"
            type='file'
            accept='.xlsx'
            onChange={handleUpload}
          />
          <button className="btn-1-mod btn-1-green" name="saveBtn" onClick={save}>
              Save
          </button>
          <button className="btn-1-mod btn-1-blue" onClick={() => openForm()} >{isForm? "Закрыть форму" : "Открыть форму"}</button>
        </div>
          {isForm? <ChangeForm  />: null}
          <ReactExcel
            style="overflow-y:scroll;"
            initialData={initialData}
            onSheetUpdate={(curSheet) => {
              setCurrentSheet(curSheet);
              console.log('Current Sheet', currentSheet);

              changeInfoTable(curSheet);

              let result = generateObjects(curSheet);
              
              setJSONTable(result);
            }}
            activeSheetClassName='active-sheet'
            reactExcelClassName='react-excel'
          />
        </>
      </Context.Provider>
    );
  }

export default ExcelForm;
