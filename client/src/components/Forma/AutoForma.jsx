import React, { Fragment, useState, useEffect } from "react";
import { withTheme } from '@rjsf/core';
import { Theme as MaterialUITheme } from '@rjsf/material-ui';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

const AutoForma = props => {
    const Form = withTheme(MaterialUITheme);
    const { schema, formInitData, onSubmitData, addFunc, quickSearchFunc, validateFunc, uiSchema, mUIClasses } = props
    const [ formData, setFormData] = useState(formInitData);

    const log = (type) => console.log.bind(console, type);

    useEffect(() => {
        console.log("uiSchema", uiSchema)
    }, [])

    const handleChange = e => {
        console.log('e.formData old', e.formData)
        e.formData = addFunc(e.formData)
        console.log('e.formData new', e.formData)
        console.log('e.formData cur', formData)
        //if (e.formData.hasOwnProperty("articul"))
            //quickSearchFunc('articul', e, e.formData)
    }

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

    return(
        <Fragment>
            <Form 
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
                >
                    {uiSchema["ui:title"].includes("Добавить")? "Сбросить": "Сбросить"}
                </Button>
            </div>
            </Form>
        </Fragment>
    )
}

export default AutoForma
