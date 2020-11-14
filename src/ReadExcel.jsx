import React, { useEffect, useState } from 'react'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';

const ExcelForm = () => {
    const [initialData, setInitialData] = useState(undefined);
    const [currentSheet, setCurrentSheet] = useState({});
    const [JSONTable, setJSONTable] = useState({});

    const handleUpload = (event) => {
      const file = event.target.files[0];
    
      //read excel file
      readFile(file)
        .then((readedData) => setInitialData(readedData))
        .catch((error) => console.error(error));
    };

    const save = () => {

      const result = generateObjects(currentSheet);
      console.log(JSON.stringify(result));

      setJSONTable(JSON.stringify(result));


      //save array of objects to backend
      /*
      fetch('data.json', {
          method: 'POST',
          body: JSON.stringify(result),
          headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           }
      }).then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        }).then(function(response) {
            console.log("ok");
        }).catch(function(error) {
            console.log(error);
        });
        */
    };

    useEffect(() => {
        console.log(JSONTable)
    })
  
    return (
      <>
        <input
          type='file'
          accept='.xlsx'
          onChange={handleUpload}
        />
        <button onClick={save}>
            Save to API
        </button>
        <ReactExcel
            style="overflow-y:scroll;"
          initialData={initialData}
          onSheetUpdate={(currentSheet) => setCurrentSheet(currentSheet)}
          activeSheetClassName='active-sheet'
          reactExcelClassName='react-excel'
        />
      </>
    );
  }

export default ExcelForm;
