import React, { useState } from 'react'
import { Fetch } from 'react-request';
import style from './ResultStyles.js';
import bc, { lookup } from 'barcodelookup';

const Result = props => {
  const [request, setRequest] = useState(false);
  const [barcode, setBarcode] = useState('123-123-123-123');

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

  const _HTTPRequest = barcode => {
    const typeBar = barcode.replace(/-/g, '').toLowerCase();
    const urlAdd = `https://api.barcodelookup.com/v2/products?barcode=${typeBar}&formatted=y&key=8z9350lnic2gms9n5gs2mauisfrphs`; 

    var myHeaders = new Headers({
      'Content-Type': 'text/plain',
      'X-Custom-Header': 'hello world'
    });
    
    return (
    <Fetch url={urlAdd} mode= {'no-cors'} referrerPolicy={'origin'} responseType="json" headers={myHeaders} onResponse={() => { setRequest(!request); }}>
      {({ fetching, failed, data }) => {
        
        if (fetching) {
          console.log(typeBar)
          console.log('Loading data...')
          return <div>Loading data...</div>;
        }

        if (failed) {
          console.log('The request did not succeed.')
          return <div>The request did not succeed.</div>;
        }

        if (data) {
          return (
            console.log(data)
          );
        }

        return <div></div>;
    }}
    </Fetch>
    )
  }

  const _renderInput = res => {
    let barcodeLen = res.length;
    let lastResult = null;

    if (barcodeLen){
      const lastRes = _lastTenRes(res.map(item => { return item.codeResult.code}));

      res.map((barcode, i) => { if (barcodeLen === i + 1) { lastResult = barcode; } });

      return (  
      <div id="myDiv" style={style.resBox}><p style={style.someText}>
        <div style={style.flexBox}>
           <ul>{lastRes.map((item, index) => <li key={index.toString()}>{item}</li>)}</ul>
        </div>
      </p>
      <div>
          <p>{lastResult.codeResult.code}[{lastResult.codeResult.format}]</p>
          <input id="myInput" style={style.inputBarcode} onChange={onChange} placeholder="Введите номер штрихкода...">
          </input>
          <button className="btn-1 btn-1-blue">Изменить</button>
          <button className="btn-1 btn-1-red">Удалить</button>
          <button className="btn-1 btn-1-green">Добавить</button>
          <button className="btn-1 btn-1-yellow" onClick={() => handleClick(lastResult)}>{request ? 'Выполняется запрос...' : 'Запросить'}</button>
      </div>
      {request ? _HTTPRequest(barcode) : null}</div>
      )
    } else {
      return <div id="myDiv" style={style.resBox}><p style={style.someText}>"Нет сканированных кодов"</p>
      <div>
          <input id="myInput" style={style.inputBarcode} onChange={onChange} placeholder="Введите номер штрихкода...">
          </input>
          <button className="btn-1 btn-1-blue">Изменить</button>
          <button className="btn-1 btn-1-red">Удалить</button>
          <button className="btn-1 btn-1-green">Добавить</button>
          <button className="btn-1 btn-1-yellow" onClick={() => handleClick(lastResult)}>{request ? 'Выполняется запрос...' : 'Запросить'}</button>
      </div>
      {request ? _HTTPRequest(barcode) : null}</div>
    }
  }
 
  return ( _renderInput(props.result) );
};

export default Result