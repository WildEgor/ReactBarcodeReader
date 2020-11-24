import React, { useEffect, useState } from 'react'
import Contexts from '../../utils/context/Context'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
import XLSX from 'xlsx';
import ExcelFormik from '../forms/excelformik'
import Check from '../../utils/check/check'

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
  const [callback, setCallBack] = useState({
      records: {},
      status: {
        cod: "", // fetch status cod
        isLoading: false, //
      }
    })

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

  // Функция сохраниения данных в формат JSON
  const SaveToJson = (curSheet, tableName) => { 
    if (Check.Obj(curSheet)) {
      console.log('...SaveToJson...')
      console.log('CurrentSheet (SaveToJson): ', curSheet)
      setCurrentSheet(curSheet) // Запоминаем текущее состояние таблицы
      const result = generateObjects(curSheet) // создаем объект JSON из файла .xlsx
      setJSONTable(result) // записываем текущее состояние как JSON
      console.log('Table name (SaveToJson)', tableName)
      let bufferObj = {[tableName]: result} // Задать путь в файле JSON как название таблицы
      POSTJSON('http://localhost:8081/table', bufferObj)
    }
  }

  const saveBtn = () => {
    if (Check.Arr(JSONTable)){
      console.log('...SaveBtn...')
      console.log('JSONTable (saveBtn)', JSONTable)
      console.log('Current Sheet (saveBtn)', currentSheet)
      const result = generateObjects(currentSheet) // создаем объект JSON из объекта массива
      try {
        let newWB = XLSX.utils.book_new()
        let newWS = XLSX.utils.json_to_sheet(result)
        XLSX.utils.book_append_sheet(newWB, newWS, excelTable.name)
        XLSX.writeFile(newWB, "data.xlsx")
        SaveToJson(currentSheet, excelTable.name)
      } catch(e) {
        console.log('Error', e)
      }
    }
  }

  // ********************************** Search Object WHERE **********************************
  const JSONSearchByGroup = (table, query) => {
    console.log('...JSONSearch by group...')
    const url = 'http://localhost:8081/table';
    let records = []
    let indexes = []
    let groupSearch = []

    console.log('Table', table)
    console.log('query', query)

    setCallBack(old => { let newCallback = {...old}
      newCallback.status.isLoading = !newCallback.status.isLoading
      return newCallback
    })
    
    fetch(url)
      .then(async response => {
        const data = await response.json()
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        console.log('STATUS', response.status)
        if (data.hasOwnProperty(table.name)){
          for (let prop in query.str){ // Поля не с пустыми значениями в запросе 
            if (query.str[prop] !== "")
              groupSearch.push(prop)
          }
          records = data[table.name].filter((item, idx) => {
            for (let key of groupSearch)
              if (item[key] === undefined || item[key].toLowerCase() != query.str[key].toLowerCase()) {
                return false;
            }
            indexes.push(idx)
            return true;
          });
          records.forEach((item, index) => {
            item['ID'] = indexes[index]
          })

          setCallBack(old => { let newCallback = {...old}
            newCallback.records = [...records]
            newCallback.status.cod = response.status
            return newCallback
          }) 

          console.log('...TYPE OF QUERY...') 
          console.log('...', records) 
          switch(query.type){
            case 'searchBtn':
              console.log('...SEARCH...') 
              break;
            case 'addBtn':
              if (!records.length)
                tableAddItem(query.str, currentSheet, excelTable)
              break;
            case 'removeBtn':
              if (records.length)
                tableDeleteItem(records[0]['ID'], currentSheet, excelTable)
              break;
            case 'changeBtn':
              console.log('CHANGE BTN', callback.records[0]['ID'])
              console.log('CHANGE BTN', query.str)
              console.log('CHANGE BTN', currentSheet[excelTable.name])
              tableChangeItem(callback.records[0]['ID'], query.str, currentSheet, excelTable)
              break;
          }
        }
      });
     return records
  }

  const tableDeleteItem = (id, cs, table) => {
    console.log('...REMOVE...') 
    let newArr = cs[table.name].slice()
    let oldItem = newArr.splice(id + 1, 1)
    cs[table.name] = newArr.slice()

    console.log('CURSHET', cs)
    setCurrentSheet(oldObj => {
      let newObj = {...oldObj}
      newObj = {...cs}
      SaveToJson(cs, excelTable.name)
      return newObj
    })
    setCurrentSheet(cs)
  }

  const tableAddItem = (query, cs, table) => {
    let newString = []
    for (let prop of table.columns){
      if (query.hasOwnProperty(prop)){
        if (query[prop] !== ""){
          newString.push(query[prop])
        }
      } else {
        newString.push("")
      }
    }
    console.log('newString', newString)
    console.log('currentSheet', currentSheet) 
    cs[table.name].push(newString)
    setCurrentSheet(cs)
    SaveToJson(cs, excelTable.name)
  }

  const tableChangeItem = (id, newItem, cs, table) => {
    console.log('...CHANGE...',newItem) 
    let newString = []
    for (let prop of table.columns){
      if (newItem.hasOwnProperty(prop)){
          newString.push(newItem[prop])
      } else {
        newString.push("")
      }
    }

    cs[table.name].splice(id + 1, 1, newString)
    setCurrentSheet(cs)
    SaveToJson(cs, excelTable.name)
  }
  // ********************************************************************

  const POSTJSON = async (url, json) => {
    console.log('...POST to db.json...')

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    };

    fetch(url, requestOptions)
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }    
            console.log('POSTED!')
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        });
  }
  
  // Если изменилась строка запроса, то ...
  useEffect (() => {
    if (Check.Arr(JSONTable)) { 
      console.log('Incoming Query', query)
      QueryLocalTable(query);
    }
  }, [query]) 

  // Запрос в таблицу
  const QueryLocalTable = query => {
    if (!Check.Obj(query.str)){
      alert(`Введите значение по которому искать!`) 
    }
    else
    {
      JSONSearchByGroup(excelTable, query)
    }
  }

  // Изменение имени таблицы, заголовков
  const changeInfoTable = cs => { 
    console.log('...changeInfoTable...')
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
      <Contexts.Provider value={{excelTable, query, setQuery, callback, setCallBack}}>
        <>
        <div style={{display: "flex", flexDirection: "row"}}>
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
              console.log('CURRENT SHEET UPDATE', curSheet)
              let {tableName} = changeInfoTable(curSheet)
              SaveToJson(curSheet, tableName)
            }}
            activeSheetClassName='active-sheet'
            reactExcelClassName='react-excel'
          />
        </>
      </Contexts.Provider>
    );
  }

export default Excel;