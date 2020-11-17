import React, { useState, useEffect, useContext } from 'react'
import Context from './Context'

const ChangeForm = props => {
    const {excelTable, formString, setFormString} = useContext(Context);
    const [bufferString, setBufferString] = useState();

    useEffect(() => {
        console.log('componentDidMount');
        renderInputs((Object.keys(excelTable).length !== 0 && excelTable.constructor === Object)? renderInputs(excelTable): {});
    
        return () => {
            console.log('componentWillUnmount');
        };
    }, []);

    useEffect(() => {
        console.log('Cur Table useEffect', excelTable);
        renderInputs((Object.keys(excelTable).length !== 0 && excelTable.constructor === Object)? renderInputs(excelTable): {});
    }, [excelTable])

    const onChange = (e) => {    
        console.log('BufferString', bufferString);

        console.log('Event', e);
        
        setBufferString({
            ...bufferString,
            [e.target.name]: e.target.value
        })
        
        //console.log('Target value', e.target.value);
        //console.log('Target name', e.target.name);
    }

    const addItem = (Item) => {
        console.log('Add'); 
        console.log('String to Search', formString);
        let JSONString = JSON.stringify(Item);
        console.log(JSONString);
    }

    const removeItem = () => {
        console.log('Remove');
    }

    const changeItem = () => {
        console.log('Change');
    }

    const renderInputs = (tableInfo) => {
        if (typeof tableInfo !== "undefined" && (tableInfo.hasOwnProperty('name'))) {
            console.log('Cur Table renderInputs', tableInfo);

            const inputs = tableInfo.columns[0].map((value) =>
                <input name={value} key={value} placeholder={value} onChange={onChange}></input>
            );
            return (
                <div>
                    <button className="btn-1 btn-1-yellow" onClick={changeItem}>Изменить</button>
                    <button className="btn-1 btn-1-yellow" onClick={() => addItem(bufferString)}>Добавить</button>
                    <button className="btn-1 btn-1-yellow" onClick={removeItem}>Удалить</button>
                <div>{inputs}</div>
                </div>
            );
        } else {
            return (
                <p> Не выбрана таблица </p>
            );
        }
    }

    return(
        <div>
            {
                renderInputs(excelTable)
            }
        </div>
    )
}

export default ChangeForm
