import React, { Fragment, useState, useEffect } from "react";
import propTypes from 'prop-types';

// Material UI
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RotateLeftRoundedIcon from '@material-ui/icons/RotateLeftRounded';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import '../AddStudent/AddStudent.css'

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiTextField-root": {
        display: "flex",
        margin: theme.spacing(2),
        width: "35ch"
      }
    }
}));

const Forma = props => {
    const classes = useStyles();

    const { formSchema, info, setInfo, onChange, onSubmit } = props

    const [fields, setFields] = useState()

    useEffect(() => {
        console.log('formSchema', formSchema)
        initForma(formSchema)
    }, [])

    const initForma = formSchema => {
        let _formData = {};
        for(var key of Object.keys(formSchema.fields)){
            _formData[key] = "";
        }
        console.log('_formData', _formData)
        setInfo( _formData )

        setFields(Object.keys(formSchema.fields).map( (key, ind, arr) => ( getFormElement(key, formSchema.fields[key]) )))
    }

    const getFormElement = (elementName, elementSchema) => {
        let item
        const props = {
            id: elementName,
            name: elementName,
            type: elementSchema.type,
            label: elementSchema.label,
            placeholder: elementSchema.placeholder,
            ...elementSchema.options,
            InputProps: {
                inputProps:  {
                     //value: info[elementName],
                    ...elementSchema.inputProps
                }
            },
            variant: "outlined",
            className: "Add-Student-Input",
            onChange: onChange
        };

        if (elementSchema.type === "text" || elementSchema.type === "number") {
            item = <TextField {...props } />
        }

        return ( item )
    }


    return (
        <form onSubmit={ onSubmit } className={classes.root} noValidate autoComplete="off">
            { fields }
        </form>
    )
}

export default Forma

