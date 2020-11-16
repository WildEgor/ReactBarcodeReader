import React, { useState, useEffect } from 'react'

const ChangeForm = props => {

    return(
        <div>
            <div>
                <button className="btn-1 btn-1-yellow">Изменить</button>
                <button className="btn-1 btn-1-yellow">Добавить</button>
                <button className="btn-1 btn-1-yellow">Удалить</button>
            </div>
            <input placeholder="Артикул"></input>
            <input placeholder="Описание продукта"></input>
            <input placeholder="Количество всего"></input>
            <input placeholder="Продали"></input>
            <input placeholder="Остаток"></input>
            <input placeholder="Примечание"></input>
        </div>
    )
}

export default ChangeForm
