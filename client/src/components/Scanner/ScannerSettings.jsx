import React, { Fragment } from 'react'
import Select from 'react-select'
import {scannerSettings, colourStyles} from './ScannerSettingsStyle'

const ScannerSettings = props => {
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

    const handleChange = (newValue, actionMeta) => {
        console.log({newValue, actionMeta})

        /*  
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
        */
        props.updateSettings({newValue, actionMeta})
    };

  return (
    <div style={scannerSettings.wrapper}>
        <label>
        <span>Частота сканирования</span>
            <Select 
            styles={colourStyles}
            name="freqSpeed" 
            defaultValue={settings.optionsFreq[0]} 
            options={settings.optionsFreq} 
            onChange={handleChange} 
            />     
        </label>
        <label>
        <span>Типы штрихкодов</span>
            <Select
            defaultValue={[...settings.optionsFuncCode]}
            isMulti
            name="funcCode"
            options={settings.optionsFuncCode}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleChange} 
            />
        </label>
        <label>
        <span>Размеры штрихкодов</span>
            <Select 
            name="patchSize" 
            defaultValue={settings.optionsPatchSize[2]}  
            options={settings.optionsPatchSize} 
            onChange={handleChange} 
            />
        </label>
    </div>
  )
  }

  export default ScannerSettings