import React, { Fragment, useState, useEffect } from "react";
import Form from "@rjsf/material-ui";

const AutoForma = props => {
    const { schema, formInitData, onSubmitData, addFunc, validateFunc } = props
    const [ formData, setFormData] = useState(null);

    const uiSchema = {
        "ui:title": "Добавить товар",
        desc:{
            "ui:widget": "textarea"
        }
      }

    const log = (type) => console.log.bind(console, type);

    useEffect(() => {
        setFormData(formInitData)  
    }, [])

    const handleChange = e => {
        e.formData = addFunc(e.formData)
    }

    return(
        <Fragment>
            <Form 
            schema={ schema }
            uiSchema={ uiSchema }
            formData={ formData }
            onChange={ handleChange }
            onSubmit={ onSubmitData }
            onError={log("errors")}
            liveValidate 
            noHtml5Validate
            validate={ (formData, errors) => console.log(formData) }
            />
        </Fragment>
    )
}

export default AutoForma
