import React, { useState } from 'react'
import { scannerSettings } from './ScannerSettingsStyle'

import { makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
    formControl: {
        display: "flex",
        flexDirection: "column",
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 240,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  
const ScannerSettings = props => {
    const classes = useStyles();
    const [selectedValues, setSelectedValues] = useState({
        funcCode: ['code_128_reader', 'code_39_reader', 'upc_reader', 'ean_reader'],
        pathSize: 'medium',
        freq: 1,
    });

    const settings = {
        funcCode: [
        {value: "code_128_reader", label:"Code 128"}, 
        {value: "code_39_reader", label: "Code 39"},
        {value: "upc_reader", label: "Upc"},
        {value: "ean_reader", label: "Ean"},
        {value: "ean_8_reader", label: "Ean 8"},
        {value: "code_39_vin_reader", label: "Code 39 Vin"},
        {value: "codabar_reader", label: "Codebar"},
        {value: "upc_e_reader", label: "Upc E"},
        {value: "i2of5_reader", label: "Code i2of5"},
        {value: "2of5_reader", label: "Code 2of5"},
        {value: "code_93_reader", label: "Code 93"}
        ],
        pathSize: [
        {value: "x-small", label:"XSmall"}, 
        {value: "small", label: "Small"},
        {value: "medium", label: "Medium"},
        {value: "large", label: "Large"},
        {value: "x-large", label: "XLarge"},
        ],
        freq: [
        {value: 1, label:"Very slow"}, 
        {value: 5, label: "Slow"},
        {value: 15, label: "Medium"},
        {value: 20, label: "Fast"}
        ]
    } // Настройки для селекторов

    const handleChange = event => {
        setSelectedValues(oldSelected => {
            const newSelected = {...oldSelected}
            newSelected[event.target.name] = event.target.value
            return newSelected
        });
        console.log(event.target.value)
        props.updateSettings(selectedValues)
    };

  return (
    <div style={scannerSettings.wrapper}>
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-checkbox-label">Тип штрихкода</InputLabel>
        <Select
          labelId="demo-mutiple-checkbox-label"
          id="demo-mutiple-checkbox"
          name="funcCode"
          multiple
          value={selectedValues.funcCode}
          onChange={handleChange}
          input={<Input />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {settings.funcCode.map((name) => (
            <MenuItem key={name.label} value={name.value}>
              <Checkbox checked={selectedValues.funcCode.indexOf(name.value) > -1} />
              <ListItemText primary={name.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label-1">Размер штрихкода</InputLabel>
        <Select
          labelId="demo-simple-select-label-1"
          id="demo-simple-select"
          name="pathSize"
          value={selectedValues.pathSize}
          onChange={handleChange}
        >
        {settings.pathSize.map(name => (
            <MenuItem key={name.value} value={name.value}>
                {name.label}
            </MenuItem>
        ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label-1">Частота сканированирования</InputLabel>
        <Select
          labelId="demo-simple-select-label-2"
          id="demo-simple-select"
          name="freq"
          value={selectedValues.freq}
          onChange={handleChange}
        >
        {settings.freq.map(name => (
            <MenuItem key={name.value} value={name.value}>
                {name.label}
            </MenuItem>
        ))}
        </Select>
      </FormControl>
    </div>
  )
  }

  export default ScannerSettings