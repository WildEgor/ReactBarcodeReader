import React, { Fragment, useState, useEffect } from "react";
import { withTheme } from '@rjsf/core';
import { makeStyles } from '@material-ui/core/styles';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '10px 30px',
        display: 'flex',
        flexDirection: "column",
        justifyContent: "start",
        alignItems: 'left',
        width: "80vw",
        margin: "15px 0 15px 0"
      },
}))

const AutoForma = props => {
    const classes = useStyles()
    const Form = withTheme(MaterialUITheme);
    const { schema, formInitData, onSubmitData, addFunc, quickSearchFunc, validateFunc, uiSchema, mUIClasses } = props
    const [ formData, setFormData] = useState(formInitData);
    const [ resetForm, setResetForm ] = useState(false)

    const log = (type) => console.log.bind(console, type);

    const handleChange = e => {
        addFunc(e.formData)
        //e.formData = addFunc(e.formData)
    }

    useEffect(() => {
        //setFormData({articul : "test"})
    }, [])

    function transformErrors(errors) {
        return errors.map(error => {
        switch(error.name){
            case "pattern": error.message = "Недопустимое значение"
            break;
            case "required": error.message = "Поле обязательное для заполнения"
            break;
            case "maximum": error.message = `Значение не должно быть больше ${error.params.limit}`
            break;
            case "minimum": error.message = `Значение должно быть больше ${error.params.limit}`
            break;
            case "maxLength": error.message = `Длина сообщения не должна быть больше ${error.params.limit}`
            break;
            case "minLength": error.message = `Длина сообщения должна быть больше ${error.params.limit}`
            break;
        }
        console.log('Errors', error)
        return error;
        });
      }

    useEffect(() => {

    }, [resetForm])

    return(
        <Paper component="form" className={classes.root} elevation={4}>
            <Form
            id={"create-item-form"} 
            schema={ schema }
            uiSchema={ uiSchema }
            formData={ formData }
            onChange={ handleChange }
            onSubmit={ ({formData}, e) => { onSubmitData(e, formData) } }
            //onError={log("errors")}
            showErrorList={false}
            liveValidate={false} 
            noHtml5Validate
            validate={ (formData, errors) => validateFunc(formData, errors) }
            transformErrors={ transformErrors }
            >
            <div style={{display: "flex", justifyContent: "center"}}>
                <Button
                    name="AddBtn"
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    className={mUIClasses.buttonAdd}
                    startIcon={<SaveIcon />}
                >
                    {uiSchema["ui:title"].includes("Добавить")? "Добавить": "Изменить"}
                </Button>
                <Button
                    name="RstBtn"
                    type="reset"
                    variant="contained"
                    color="primary"
                    size="large"
                    className={mUIClasses.buttonReset}
                    startIcon={<RotateLeftIcon />}
                    onClick={ () => { setResetForm(!resetForm) } }
                >
                    {uiSchema["ui:title"].includes("Добавить")? "Сбросить": "Сбросить"}
                </Button>
            </div>
            </Form>
        </Paper>
    )
}

export default AutoForma
