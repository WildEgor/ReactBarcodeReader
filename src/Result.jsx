import React, { useState, useEffect } from 'react'
import { Fetch } from 'react-data-fetching';
//import { Loader } from './components'
import style from './ResultStyles.js';

const Result = props => {
  const [request, setRequest] = useState(false);
  const [barcode, setBarcode] = useState('123-123-123-123');
  const [partNumber, setPartNumber] = useState('');

  const handleClick = res => {
    setRequest(!request);
  }

  const _lastTenRes = array => {
    const [first, ...rest] = array;
    const lastArray = rest.slice(-10);
    return lastArray;
  }

  const onChange = event => {
    console.log(event.currentTarget.value);
    setBarcode(event.currentTarget.value)
  };


  const parseData = (data) => {

    if (typeof data !== "undefined"){
      let obj = data.products[0];

      let partnumber = obj.mpn;

      let model = obj.model;
      let prodName = obj.product_name;
      let prodTitle = obj.title;
      let prodCat = obj.category;
      let prodManuf = obj.manufacturer;
      let prodBrand = obj.brand;
      let prodDesc = obj.description;
      let prodImage = obj.images[0];
      console.log(prodImage);

      return (
        <div className ="product">
          <img className="product-image" src={prodImage} alt=""/>
            <div className="product-form">
              <div>
                <h1>{`Наименование: ${prodTitle} | Имя продукта: ${prodName} | Партномер: ${partnumber}`}</h1>
                <h1>Описание</h1>
                <p>{`Производитель: ${prodManuf} | Товар: ${prodBrand} | Категория: ${prodCat}`}</p>
                <p>{prodDesc}</p>
              </div>
            </div>
        </div>
      )
    }
    return null
  }


  const _HTTPRequest = barcode => {
    const typeBar = barcode.replace(/-/g, '').toLowerCase();
    const apiKey = '8z9350lnic2gms9n5gs2mauisfrphs';
    const urlAdd = `https://api.barcodelookup.com/v2/products?barcode=${typeBar}&formatted=y&key=${apiKey}`; 

    return (
      <div>
        <Fetch
          loader={<div>Loading...</div> } // Replace this with your lovely handcrafted loader
          url= {urlAdd}
          timeout={5000}
        >
          {({ data }) => parseData(data) }
        </Fetch>
      </div>
    )
  }

  const _renderInput = res => {
    let barcodeLen = res.length;
    let lastResult = null;

    if (barcodeLen){
      const lastRes = _lastTenRes(res.map(item => { return item.codeResult.code}));

      res.map((barcode, i) => { if (barcodeLen === i + 1) { lastResult = barcode; } });

      return (
          <div id="myForm" style={style.resColumnBox}>
          <div style={style.resBox}>
          <p style={style.someText}>Последние 10 сканированных штрихкодов</p>
                <div style={style.flexBox}>
                  <ul>{lastRes.map((item, index) => <li key={index.toString()}>{item}</li>)}</ul>
                </div>
            <div>
                <p>{lastResult.codeResult.code}[{lastResult.codeResult.format}]</p>
              <input id="myInput" style={style.inputBarcode} onChange={onChange} placeholder="Введите номер штрихкода...">
              </input>
              <button className="btn-1 btn-1-blue">Изменить</button>
              <button className="btn-1 btn-1-red">Удалить</button>
              <button className="btn-1 btn-1-green">Добавить</button>
              <button className="btn-1 btn-1-yellow" onClick={() => handleClick(lastResult)}>{request ? 'Выполняется запрос...' : 'Запросить'}</button>
            </div>
          </div>
          <div>
            {request ? _HTTPRequest(barcode) : null}
          </div>
        </div> 
      )
    } else {
      return (
        <div id="myForm" style={style.resColumnBox}>
        <div style={style.resBox}>
          <p style={style.someText}>Нет скнированных штрихкодов</p>
          <div>
            <input id="myInput" style={style.inputBarcode} onChange={onChange} placeholder="Введите номер штрихкода...">
            </input>
            <button className="btn-1 btn-1-blue">Изменить</button>
            <button className="btn-1 btn-1-red">Удалить</button>
            <button className="btn-1 btn-1-green">Добавить</button>
            <button className="btn-1 btn-1-yellow" onClick={() => handleClick(lastResult)}>{request ? 'Выполняется запрос...' : 'Запросить'}</button>
          </div>
        </div>
        <div>
          {request ? _HTTPRequest(barcode) : null}
        </div>
      </div>  
      )
    }
  }
 
  return ( _renderInput(props.result) );
};

export default Result