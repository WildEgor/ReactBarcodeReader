import React, {Fragment, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./SearchStudents.css";

import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: "green",
  }
  },
}));

const SearchStudents = props => {
  const [value, setValue] = useState("")
  const [isFound, setIsFound] = useState(true)

  const handleChange = e => {
    console.log(e.target.value)
    setValue(e.target.value)
    letSearch(e.target.value)
  }

  useEffect(() => {
    console.log('Its me, scanner!', props.scannerSearch);
    setValue(props.scannerSearch)
    letSearch(props.scannerSearch)
  }, [props.scannerSearch])

  const letSearch = query => {
    if (value !== query){
      console.log('Search...', `${value} and ${query}`)
      setValue(query)
      let isFound = props.searchStudents(query)
      isFound.then(resolve => setIsFound(resolve))
      console.log('value', value)
    } else {
      console.log('Not Search')
      setIsFound(false)
    }
  }

  return (
    <Fragment>
    <input
      value={value}
      type="text"
      placeholder="Поиск по артикулу..."
      name="articul"
      onChange={ handleChange }
      className="Search-Student-Input"
    />
    {(!isFound && value !== "")? 
          <Link 
            to={
              { 
                  pathname: "/add",
                  query : value
              }
          } 
          className="Add-Button">
            <Button
              variant="contained"
              color="primary"
              size="small"
              className="button"
              startIcon={<CreateIcon />}
            >
            Добавить
            </Button>
          </Link>
          :null }
    </Fragment>
  );
}

export default SearchStudents;
