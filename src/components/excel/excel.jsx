import React, { useEffect, useState } from 'react'
import Context from '../../utils/context/Context'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
import XLSX from 'xlsx';
import ExcelFormik from '../forms/excelformik'

const Excel = () => {
    const [initialData, setInitialData] = useState() // При загрузке таблицы получаем начальные данные
    const [currentSheet, setCurrentSheet] = useState({}) // Храним текущее состояние таблицы
    const [excelTable, setExcelTable] = useState({}); // Храним основные данные о таблице (название текущего листа, заголовки)
    const [JSONTable, setJSONTable] = useState({}) // Храним текущее состояние таблицы в формате json
    const [isForm, setIsForm] = useState(false); // Открытие формы (только если загружена таблица)
    const [formString, setFormString] = useState({}) // Строка для поиска/записи/изменения
    const [lastQuery, setLastQuery] = useState({})

    // Функция для чтения файла с таблицей .xlsx
    const handleUpload = event => { 
      const file = event.target.files[0];
      readFile(file)
        .then((readedData) => {
          setInitialData(readedData);
        })
        .catch((error) => console.error(error));
    };

    // Открытие формы
    const openForm = () => { 
      if (Object.keys(excelTable).length !== 0 && excelTable.constructor === Object && typeof excelTable !== "undefined" && excelTable.hasOwnProperty('name')) {
        setIsForm(!isForm);
      }
    }

    // Функция сохраниения данных в формат JSON
    const SaveToJson = () => { 
      console.group('SaveToJson');
      if (Object.keys(currentSheet).length !== 0 && currentSheet.constructor === Object) {
    
        console.log('CurrentSheet (save): ', currentSheet);
          
        const result = generateObjects(currentSheet); // создаем объект JSON из файла .xlsx
        setJSONTable(result); // записываем текущее состояние как JSON
        let bufArr = {[excelTable.name]: result} // Задать путь в файле JSON как название таблицы
  
        var headers = new Headers(); 
        headers.append('Content-Type', 'application/json');
    
        var options = {
          method: 'POST',
          headers: headers,
          mode: 'cors',
          cache: 'default',
          body:  JSON.stringify(bufArr)
        };
  
        var request = new Request('http://localhost:8081/table', options); // Обновить JSON
        fetch(request).then(function(response) {
      
        console.log("Success");
            return response;
        }).then(function(json) {
        console.log(json.errors);
        }).catch(function(err) {
        console.log("Error " + err);
        })
        
        fetch('http://localhost:8081/table') // Запросить текущий файл JSON
          .then(response => response.json())
          .catch(error => console.error('Error:', error))
          .then(response => console.log('Success:', JSON.stringify(response)));
      }
    };

    const saveBtn = () => {
      if (typeof JSONTable !== "undefined") {
        const result = generateObjects(currentSheet); // создаем объект JSON из файла .xlsx
        console.log('SAVE JSON TO TABLE...', currentSheet); 
        let newWB = XLSX.utils.book_new();
        let newWS = XLSX.utils.json_to_sheet(result);
        console.log(excelTable.name);
        XLSX.utils.book_append_sheet(newWB, newWS, excelTable.name);
        XLSX.writeFile(newWB, "data.xlsx");
        SaveToJson();
      }
    }

// ************************************ Поиск ********************************************
  function escapeRegExp(it){
    return String(it).replace(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1');
  }
  
  function checkMatch(request, item) {
    var _regex = new RegExp('^' + escapeRegExp(request), 'i');
    return _regex.test(item);
  }

  async function FINDLocal(table, tableFieldName, tableFieldValue){
    const url = 'http://localhost:8081/table';
    let result = "";
    let resData = [];
    let index = -1;
    
    let promise = new Promise((resolve, reject) => {
      fetch(url).then(response => 
        response.json().then(data => ({
            data: data,
            status: response.status
        })
      )
      .then(res => {
          console.log('GET \'', res.status)
          resData = res.data[table.name];
          result = res.data[table.name].filter((jsonObj, i, arr) => {
            let item = jsonObj[tableFieldName];
            if (checkMatch(item, tableFieldValue) && (item.length === tableFieldValue.length)) {
              index = resData.findIndex(x => x[tableFieldName] === tableFieldValue)
              return true;
            } else {
              return false;
            }
          });
          result.push(index);
          resolve(result);
      }));
    });

    return await promise;
  }
// *******************************************************************************************

  // Если изменилась строка запроса, то ...
  useEffect (() => {
    console.log(typeof JSONTable)
    if (JSONTable.length !== 0 && JSONTable.constructor === Array) { 
      QueryLocalTable(formString);
    }
  }, [formString]) 

  // Добавить запись 
  const AddItem = (item) => {
    console.group('AddItem'); 
    let arr = []
    console.log(item); 
    for (let prop in item) {
      arr.push(item[prop])
    }

    let arrNew = currentSheet[excelTable.name];
    console.log('arrOld ', arrNew);
    console.log('arr', arr);
    
    if (arr.length){
      arrNew.push(arr);
      console.log(arrNew); // {Артикул: "123", Описание продукта: "aaa", Количество всего: "3", Продали: "2", Остаток: "1", …}
      console.log('arrNew ', arrNew);
      
      setCurrentSheet(oldObject => {
        let newObject = { ...oldObject[excelTable.name] };
        newObject = arrNew.splice();
        return newObject;
      });
      setCurrentSheet(currentSheet);
    }
  }

  // Удалить запись
  async function DeleteItem(index){
    console.log('DeleteItem', currentSheet);
    let arrNew = [];
    let promise = new Promise((resolve, reject) => {
      arrNew = currentSheet[excelTable.name].filter((item, idx) => {
        if (idx !== index + 1)
          return item
      })
      resolve(arrNew)
    })
    return await promise
  }

  // Запрос в таблицу
  const QueryLocalTable = queryStr => { 
    if (!(excelTable.columns[0][0] in queryStr)){
      alert(`Введите хотя бы значение в поле ${excelTable.columns[0][0]}`)
    } else {
      let btnInd = queryStr.isBtn;

      delete queryStr.isBtn

      console.log('QUERY...', queryStr);
      const oldObj = [...JSONTable]; // Получить данные JSON
      console.log('Current JSONTable: ', oldObj); 

      delete formString.status;
      delete formString.index;

      let searchField = ''
      for (let prop in formString) {
        searchField = prop
      }

      console.log('Search field...', searchField);
      
      FINDLocal(excelTable, searchField, formString[searchField]).then(
        function(response){
          if (response.length > 1){
          console.log('Есть запись', response[0]);
          console.log('По индексу', response[1]);
          setLastQuery(response[0]);
          setLastQuery((oldObject) => {
            let newObject = { ...oldObject };
            newObject.status = 'has record';
            newObject.index = response[1];
            return newObject;
          });

          if (btnInd === 'removeBtn'){
            DeleteItem(response[1]).then( resolve => {
                console.log('REMOVED', resolve);
                console.log('REMOVED', currentSheet);
                // **************************************************************** HERE **************************************
              }
            );
          }
        } else {
          console.log('Нет записи');
          setLastQuery((oldObject) => {
            let newObject = { ...oldObject };
            newObject.status = 'no record';
            newObject.index = -1;
            return newObject;
            });
            if (btnInd === 'addBtn'){
              console.log('Add query...', formString);
              AddItem(queryStr)
            }
          }
        }
      )
    }
  }

  // Изменение имени таблицы, заголовков
  const changeInfoTable = cs => { 
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
    
    return (
      <Context.Provider value={{excelTable, formString, setFormString, lastQuery}}>
        <>
        <div style={{display: "flex"}}>
          <input
            className="btn-1-mod btn-1-yellow"
            type='file'
            accept='.xlsx'
            onChange={handleUpload}
          />
          <button className="btn-1-mod btn-1-green" name="saveBtn" onClick={saveBtn}>
              Save
          </button>
          <button className="btn-1-mod btn-1-blue" onClick={() => openForm()} >{isForm? "Закрыть форму" : "Открыть форму"}</button>
        </div>
          {isForm? 
          <div>
            <ExcelFormik />
          </div>
          : null}
          <ReactExcel
            style="overflow-y:scroll;"
            initialData={initialData}
            onSheetUpdate={(curSheet) => {
              setCurrentSheet(curSheet);
              console.log('CURRENT SHEET UPDATE', curSheet);

              changeInfoTable(curSheet);

              let result = generateObjects(curSheet);
              
              setJSONTable(result);
              SaveToJson();
            }}
            activeSheetClassName='active-sheet'
            reactExcelClassName='react-excel'
          />
        </>
      </Context.Provider>
    );
  }

export default Excel;