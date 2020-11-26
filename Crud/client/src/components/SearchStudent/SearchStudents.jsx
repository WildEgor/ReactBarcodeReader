import React, {Fragment, useState, useEffect } from "react";
import "./SearchStudents.css";

const SearchStudents = props => {
  const [value, setValue] = useState("")

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
      setValue(query)
      props.searchStudents(query)
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
    </Fragment>
  );
}

export default SearchStudents;
