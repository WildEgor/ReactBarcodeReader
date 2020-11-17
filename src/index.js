import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Scanner from './Scanner'
import Result from './Result'
import Select from 'react-select'
import ExcelForm from './ExcelForm'
import './styles.css';

// Главное приложение-родитель
const App = props => {
  const [scanning, setScanning] = useState(false) // Состояние кнопки Старт/Стоп
  const [myConfig, setMyConfig] = useState(
    {
      funcCode: ['code_128_reader', 'code_39_reader'],
      patchSize: "x-small",
      freqSpeed: 1
    }
  ) // Конфигурация, которая передается в виде props в компонент Scanner чтобы перенастроить алгоритм 

  const settings = {
    optionsFuncCode: [
      {value: "code_128_reader", label:"Code 128"}, 
      {value: "code_39_reader", label: "Code 39"},
      {value: "upc_reader", label: "Upc"},
      {value: "ean_reader", label: "Ean"}
      ],
    optionsPatchSize: [
      {value: "x-small", label:"XSmall"}, 
      {value: "small", label: "Small"},
      {value: "medium", label: "Medium"},
      {value: "large", label: "Large"}
      ],
    optionsFreq: [
      {value: 1, label:"Very slow"}, 
      {value: 5, label: "Slow"},
      {value: 15, label: "Medium"},
      {value: 20, label: "Fast"}
      ]
  } // Настройки для селекторов

  const [results, setResult] = useState([]) // Текущий результат сканирования 

  const _scan = () => {
    setScanning(!scanning)
  }

  const _onDetected = result => {
    setResult( results.concat( [ result ] ) )
  }

  const handleChange = (newValue, actionMeta) => {
    let freqSpeed = myConfig.freqSpeed;
    let patchSize = myConfig.patchSize;
    let funcCode = myConfig.funcCode;

    switch (actionMeta['name']) {
      case 'select_speed':
        freqSpeed = newValue.value;
        break;
      case 'select_barcodeType':
        if (newValue === null) {

        } else
        {
          let result = newValue.map(({ value }) => value);
          funcCode = result.slice();
        }
        break;
      case 'select_locatorPatch':
        patchSize = newValue.value;
        break;
      default:
        break  
    }
    /*  
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    */
    console.log('New Values', freqSpeed, funcCode, patchSize);
    setMyConfig(oldObject => {
      const newObject = { ...oldObject };
      newObject.freqSpeed = freqSpeed;
      newObject.patchSize = patchSize;
      newObject.funcCode = funcCode;
    return newObject;
    });
  };

  return (
    <div className="scannerWindow">
      <button name="scanBtn" className="btn-1 btn-1-green" onClick={_scan}>
            {scanning ? 'Stop' : 'Start'}
      </button>
      <div className="results">
        <div>{scanning ? <Scanner config={myConfig} onDetected={_onDetected} /> : <div>Упс... Либо нет камеры, либо нажмите кнопку выше для активации сканера</div>}</div>
        <div>{scanning ? 
        <div>
          <div>
            <h3>Настройки сканнера</h3>
            <span>Частота сканирования</span>
            <Select name="select_speed" defaultValue={settings.optionsFreq[0]} options={settings.optionsFreq} onChange={handleChange} />     
            <span>Типы штрихкодов</span>
            <label>
              <Select
                defaultValue={[settings.optionsFuncCode[0], settings.optionsFuncCode[1]]}
                isMulti
                name="select_barcodeType"
                options={settings.optionsFuncCode}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange} 
              />
            </label>
            <span>Размеры штрихкодов</span>
            <Select name="select_locatorPatch" defaultValue={settings.optionsPatchSize[0]}  options={settings.optionsPatchSize} onChange={handleChange} />
          </div>
          </div>
          : null}</div>
      </div>
      <Result result = {results}/>
      <ExcelForm />
    </div>
  )
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)