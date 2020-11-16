import React, { useEffect, useState } from 'react'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
import XLSX from 'xlsx';

const ExcelForm = () => {
    const [initialData, setInitialData] = useState() // При загрузке таблицы получаем начальные данные
    const [currentSheet, setCurrentSheet] = useState({}) // Храним текущее состояние таблицы
    const [excelTable, setExcelTable] = useState({}); // Храним основные данные о таблице (название текущего листа, заголовки)
    const [JSONTable, setJSONTable] = useState({}) // Храним текущее состояние таблицы в формате json

    const handleUpload = (event) => { // Функция чтения файла с таблицей 
      const file = event.target.files[0];
    
      readFile(file)
        .then((readedData) => {
          setInitialData(readedData);
          console.log('Initial Data', initialData);
        })
        .catch((error) => console.error(error));
    };

    const save = () => { // Функция сохраниения данных в формат JSON и перезапись текущего файла (Только по кнопке)
      if (typeof currentSheet !== "undefined") {
      const result = generateObjects(currentSheet);

      setJSONTable(JSON.stringify(result, null, ' '));
     
      if (typeof JSONTable !== "undefined"){
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
      const testString = {
          'Артикул': 77, 
          'Описание продукта': "aaa", 
          'Количество всего': 4, 
          'Продали': 2, 
          'Остаток': 2, 
          'Примечание': 'aaa'
      };

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

      /*
      const obj =  {'Артикул': 777, 'Описание продукта': "aaa", 'Количество всего': 4, 'Продали': 2, 'Остаток': 2, 'Примечание': 'aaa'};
      const testRow = [777, "aaa", 4, 2, 2, "aaa"];
      let bufferArr = currentSheet;
      const oldObj = [...JSONTable];
      console.log('CURSHET:', currentSheet);
      
      bufferArr['New Data'].push(testRow);
      
      console.log('bufferArr ', bufferArr['New Data']);

      console.log('OldJSON',oldObj);

      
      oldObj.push(obj);
      
      setJSONTable(oldObject => {
        let newObject = { ...oldObject };
        newObject = [...oldObj];
        return newObject;
      });

      console.log('NewJSON', JSONTable);
      */
    }
    
    return (
      <>
        <input
          type='file'
          accept='.xlsx'
          onChange={handleUpload}
        />
        <button onClick={save}>
            Save
        </button>

        <button onClick={changerBtn}>
          Changer
        </button>
        <ReactExcel
          style="overflow-y:scroll;"
          initialData={initialData}
          onSheetUpdate={(curSheet) => {
            setCurrentSheet(curSheet);
            console.log('Current Sheet', currentSheet);

            changeInfoTable(curSheet);

            let result = generateObjects(curSheet);
            //console.log('Result JSON', result);
            
            setJSONTable(result);
            //console.log('New table: ', JSONTable);
          }}
          activeSheetClassName='active-sheet'
          reactExcelClassName='react-excel'
        />
      </>
    );
  }

export default ExcelForm;
