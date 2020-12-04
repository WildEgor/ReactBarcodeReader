import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      display: "flex",
      margin: theme.spacing(2),
      width: "35ch"
    }
  }
}));

export default function Formik(props) {
  const classes = useStyles();

  const { formSchema, defValues, updateData, onSubmit } = props
    const [innerState, setInnerState] = useState(defValues)
    const [fields, setFields] = useState()
    const [buttons , setButtons] = useState()

    useEffect(() => { initForma(formSchema) }, [])

    const initForma = formSchema => {
        let _formData = {};
        for(var key of Object.keys(formSchema.fields)){
            _formData[key] = "";
        }
        setFields(Object.keys(formSchema.fields).map( (key, ind, arr) => ( getFormElement(key, formSchema.fields[key]) )))
        setButtons(Object.keys(formSchema.buttons).map( (key, ind, arr) => ( getFormElement(key, formSchema.buttons[key]) )))
    }

    const getFormElement = (elementName, elementSchema) => {
        let item
        const propsInput = {
            id: elementName,
            name: elementName,
            type: elementSchema.type,
            label: elementSchema.label,
            value: innerState[elementName],
            placeholder: elementSchema.placeholder,
            ...elementSchema.options,
            InputProps: {
                inputProps:  {
                  ...elementSchema.inputProps
                }
            },
            variant: "outlined",
            onChange: (e) => { 
              let inputName = e.target.name
              let inputValue = e.target.value
              updateData(e.target)
              setInnerState(oi => {
                let ni = {...oi}
                ni[inputName] = inputValue
                return ni
              })
            }
        };

        const propsButton = {
          id: elementName,
          type: elementSchema.type,
          ...elementSchema.options
        }

        if (elementSchema.type === "text" || elementSchema.type === "number") {
            item = <TextField key={"key_" + propsInput.id + "_" + propsInput.label} {...propsInput } />
        } 

        if (elementSchema.type == "submit" || elementSchema.type == "reset") {
          item = <Button key={"key_" + elementName} {...propsButton}>
            {elementSchema.label}
          </Button>
        }

        return ( item )
    }

  return (
    <form onSubmit={onSubmit} className={classes.root}>
      { fields }
      <div>
      { buttons }
      </div>
    </form>
  );
}