import React, { useEffect, useState } from 'react'
import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';

const ExcelForm = () => {
    const [initialData, setInitialData] = useState(undefined);
    const [currentSheet, setCurrentSheet] = useState(undefined);
    const [excelTable, setExcelTable] = useState(
      {
        name: "New Data",
        heads: ['head1', 'head2']
      });
    const [JSONTable, setJSONTable] = useState(undefined);

    const handleUpload = (event) => {
      const file = event.target.files[0];
    
      //read excel file
      readFile(file)
        .then((readedData) => setInitialData(readedData))
        .catch((error) => console.error(error));
    };

    const save = () => {
      const result = generateObjects(currentSheet);
      setJSONTable(JSON.stringify(result));
      console.log('Saved: ', JSONTable);
    };

    useEffect(() => {
      if (currentSheet !== undefined) {
        save()
      }
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
          onSheetUpdate={(currentSheet) => {

            for (let prop in currentSheet){
              setExcelTable({
                ...excelTable,
                heads: excelTable.heads.splice(0, excelTable.heads.length, ...currentSheet[prop][0])
              });
            }
            
            setCurrentSheet(currentSheet)
          }}
          activeSheetClassName='active-sheet'
          reactExcelClassName='react-excel'
        />
      </>
    );
  }

export default ExcelForm;
