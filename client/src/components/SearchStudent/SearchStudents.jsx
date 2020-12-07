import React, {Fragment, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./SearchStudents.css";

import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import IconButton from '@material-ui/core/IconButton';

import Paper from '@material-ui/core/Paper';

import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    flexDirection: "column",
    justifyContent: "start",
    alignItems: 'left',
    width: "80vw",
    margin: "15px 0 15px 0"
  },
  button: {
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: "green",
  }
  },
  formControl: {
    width: "20vh",
    margin: theme.spacing(2)
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "75vw"
  },
}));

const SearchStudents = props => {
  const classes = useStyles()
  const [searchItemList, setSearchItemList] = useState({
    articul: 'Артикул',
    notes: 'Примечание'
  })
  const [searchItem, setSearchItem] = useState('articul')
  const [searchMenuItems, setSearchMenuItems] = useState()
  const [value, setValue] = useState("")
  const [isFound, setIsFound] = useState(true)

  useEffect(() => {
    console.log(searchItem)
  }, [searchItem])
  // 
  const handleChange = e => {
    console.log(typeof props.table)
    setValue(e.target.value)
    letSearch(e.target.value)
    //letSearch(e.target.value)
  }

  const handleSelectorChange = (event) => {
    setSearchItem(event.target.value);
  };

  const renderMenuItems = () => {
    let listItems = []
    for (let prop in searchItemList){
      listItems.push(
        <MenuItem value={prop} key={"searchSelector-item_"+prop}>{searchItemList[prop]}</MenuItem>
      )
    }
    setSearchMenuItems(listItems)
    console.log(listItems)
  }

  useEffect(() => {
    renderMenuItems()
  }, [])

  useEffect(() => {
    if (typeof props.table !== "undefined")
      letSearch(value)
  }, [value])

  // Если что-то обнаружил сканнер, то 
  useEffect(() => {
    setValue(props.scannerSearch)
    //letSearch(props.scannerSearch)
  }, [props.scannerSearch])

  const letSearch = query => {
    console.log('Search event')
    setValue(query)
    let isFound = props.searchStudents(query, searchItem) // Передаем запрос к родителю и делаем поиск
    isFound.then(resolve => setIsFound(resolve)) // Если найдено что-то устанавливаем флаг
  }

  return (
    <Fragment>
    <Paper component="form" className={classes.root} elevation={4}>
      <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Поиск по:</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={ searchItem }
        onChange={ handleSelectorChange } 
      >
        { searchMenuItems }
      </Select>
    </FormControl>
    <div style={{display: "flex", flexDirection: "row"}}>
      <InputBase
        type="search"
        value={value}
        name="searchField"
        onChange={ handleChange }
        className={classes.input}
        placeholder="Поиск товара на складе..."
        inputProps={{ 'aria-label': 'search google maps' }}
      />
      {(!isFound && value !== "")? 
          <Link 
            to={
              { 
                  pathname: "/add",
                  query : {
                    type: searchItem,
                    value: value 
                  }
              }
            } 
          className="Add-Button">
            <IconButton className={ classes.iconButton } aria-label="search" >
              <CreateIcon />
            </IconButton>
          </Link>
          :null }
    </div>
    </Paper>
    </Fragment>
  );
}

export default SearchStudents;
