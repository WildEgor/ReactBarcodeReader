import React, { useEffect, useState } from 'react'
import Context from '../../utils/context/Context'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
import XLSX from 'xlsx';
import ExcelFormik from '../forms/excelformik'

const Excel = () => {
    const [initialData, setInitialData] = useState() // При загрузке таблицы получаем начальные данные
    const [currentSheet, setCurrentSheet] = useState({}) // Храним текущее состояние таблицы
    const [excelTable, setExcelTable] = useState({
      name: "",
      columns: []
    }); // Храним основные данные о таблице (название текущего листа, заголовки)
    const [JSONTable, setJSONTable] = useState({}) // Храним текущее состояние таблицы в формате json
    const [isForm, setIsForm] = useState(false); // Открытие формы (только если загружена таблица)
    const [query, setQuery] = useState({
      type: "", // isBtn -> searchBtn, addBtn, changeBtn, removeBtn
      str: {} // JSON query string
    }) // Строка для поиска/записи/изменения
    const [callback, setCallBack] = useState(
      {
        records: [], // JSON back string
        status: {
          cod: "", // fetch status cod
          isLoading: false, //
        }
      }
    )

    // Функция для чтения файла с таблицей .xlsx
    const handleUpload = event => { 
      console.log('Read input excel file...')
      const file = event.target.files[0];
      readFile(file)
        .then((readedData) => {
          setInitialData(readedData);
        })
        .catch(error => { console.log('Error when read input excel file!', error)});
    }

    // Открытие формы
    const openForm = () => { if (initialData) setIsForm(!isForm); }

    // Проверка объекта
    const checkObj = obj => {
      if (Object.keys(obj).length !== 0 && obj.constructor === Object) {
        return true
      } else {
        return false
      }
    }

    // Проверка массива
    const checkArr = arr => {
      if (arr.length !== 0 && arr.constructor === Array){
        return true
      } else {
        return false
      }
    }

    // Функция сохраниения данных в формат JSON
    const SaveToJson = (curSheet, tableName) => { 
      if (checkObj(curSheet)) {
        console.group('...SaveToJson...')
        console.log('CurrentSheet (SaveToJson): ', curSheet)
        setCurrentSheet(curSheet) // Запоминаем текущее состояние таблицы
        const result = generateObjects(curSheet) // создаем объект JSON из файла .xlsx
        setJSONTable(result) // записываем текущее состояние как JSON
        console.log('Table name (SaveToJson)', tableName)
        let bufferObj = {[tableName]: result} // Задать путь в файле JSON как название таблицы
  
        var headers = new Headers(); // Устанавливаем заголовки для запроса
        headers.append('Content-Type', 'application/json')
        var options = {
          method: 'POST',
          headers: headers,
          mode: 'cors',
          cache: 'default',
          body:  JSON.stringify(bufferObj)
        }
  
        var request = new Request('http://localhost:8081/table', options) // Обновить JSON POST-запросом
        fetch(request)
          .then(response => {
            console.log("Success");
            return response; })
          .then( json => { console.log('JSON error', json.errors); })
          .catch( err => { console.log('Ошибки JSON', err); })
      }
    }

    const saveBtn = () => {
      if (typeof JSONTable !== "undefined"){
        console.group('...SaveBtn...')
        console.log('JSONTable (saveBtn)', JSONTable)
        console.log('Current Sheet (saveBtn)', currentSheet)
        const result = generateObjects(currentSheet) // создаем объект JSON из объекта массива
        
        let newWB = XLSX.utils.book_new()
        let newWS = XLSX.utils.json_to_sheet(result)
        XLSX.utils.book_append_sheet(newWB, newWS, excelTable.name)
        XLSX.writeFile(newWB, "data.xlsx")
        SaveToJson(currentSheet, excelTable.name)
      }
    }

// **************************************** JSONtoCurrentSheetObject **********************************************
    const JSONtoCurSheet = jsonTable => {
      let arrOfValues = []
      let arrOfKeys = []
      jsonTable.forEach(item => {
        arrOfValues.push(Object.values(item))
        arrOfKeys.push(Object.keys(item))
      })
      const newSheet = [arrOfKeys].concat(arrOfValues) 
      console.log('Array (generateObject)', newSheet);
      return newSheet
    }
// ***************************************************************************************************

  // ********************************** Search Object WHERE **********************************
  const JSONSearchByGroup = async (table, query) => {
    console.group('...JSONSearch by group...')
    const url = 'http://localhost:8081/table';
    let records = []
    let groupSearch = []

    console.log('Table', table)
    console.log('query', query)

    setCallBack(old => {
      let newCallback = {...old}
      newCallback.status.isLoading = !newCallback.status.isLoading
      return newCallback
    })

    await fetch(url)
      .then(response => response.json()
      .then(data => ({
          data: data,
          status: response.status
      }))
      .catch(err => console.log(err))
      .then(res => {
        if (res.data.hasOwnProperty(table.name)){
          for (let prop in query){
            if (query[prop] !== "")
              groupSearch.push(prop)
          }
          records = res.data[table.name].filter((item, idx) => {
            for (let key of groupSearch) {
              if (item[key] === undefined || item[key].toLowerCase() != query[key].toLowerCase())
                return false;
            }
            return true;
          });
          setCallBack(old => {
            let newCallback = {...old}
            newCallback.records.splice(0, newCallback.records.length,  {...records})
            newCallback.status.cod = res.status
            return newCallback
          })
          setQuery(old => {
            let newQuery = {...old}
            newQuery.str = {}
            return newQuery
          })
        }
      }))
    return records
  }
  // ********************************************************************

  // Если изменилась строка запроса, то ...
  useEffect (() => {
    if (checkArr(JSONTable)) { 
      console.log('Incoming Query', query)
      QueryLocalTable(query);
    }
  }, [query]) 

  // Запрос в таблицу
  const QueryLocalTable = query => {
      switch (query.type){
        case 'searchBtn':
          let GroupSearch = []
          for (let prop in query.str){
            GroupSearch.push(prop)
            var searchField = prop
          }
          if (!searchField)
            alert(`Введите значение по которому искать!`)
          else
            console.log(GroupSearch);
            let recd = JSONSearchByGroup(excelTable, query.str)
            console.log('Search example', recd)
          break;
        case 'addBtn':
            console.log('Add')
          break;  
      }   
  }

  // Изменение имени таблицы, заголовков
  const changeInfoTable = cs => { 
    console.group('...changeInfoTable...')
    let tableName = Object.keys(cs)[0].toString();
    let tableHeads = cs[tableName][0];
    console.log('Current Table Name', tableName)
    console.log('Current Table Heads', tableHeads)
    setExcelTable(oldObject => {
      let newObject = { ...oldObject };
      newObject.name = tableName;
      newObject.columns.splice(0, newObject.columns.length, ...tableHeads);
      return newObject;
    });
    return {tableName, tableHeads}
  };
    
    return (
      <Context.Provider value={{excelTable, query, setQuery, callback, setCallBack}}>
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
            initialData={initialData}
            onSheetUpdate={(curSheet) => {
              console.log('CURRENT SHEET UPDATE', curSheet);
              let {tableName} = changeInfoTable(curSheet);
              SaveToJson(curSheet, tableName);
            }}
            activeSheetClassName='active-sheet'
            reactExcelClassName='react-excel'
          />
        </>
      </Context.Provider>
    );
  }

export default Excel;