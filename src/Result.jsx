import React, { Component } from 'react'
import { Fetch } from 'react-request';
import style from './ResultStyles.js';

import bc, { lookup } from 'barcodelookup';

class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      request: false,
      barcode: 123,
    };
    // Эта привязка обязательна для работы `this` в колбэке.
    this.handleClic = this.handleClic.bind(this);
  }

  handleClic(res) {
    this.setState({barcode: document.querySelector('#myInput').value});
    //this.setState({barcode: res.codeResult.code});
    this.setState(state => ({ request: !state.request }));
  }

  _HTTPRequest = (barcode) => {
    const typeBar = barcode.replace(/-/g, '').toLowerCase();
    const urlAdd = `https://api.barcodelookup.com/v2/products?barcode=${typeBar}&formatted=y&key=8z9350lnic2gms9n5gs2mauisfrphs`;

   bc.lookup({
      key: '8z9350lnic2gms9n5gs2mauisfrphs',
      barcode: typeBar
    }).then(console.log('HTTP'));
    
    return (
    <Fetch url={urlAdd} mode= {'no-cors'} referrerPolicy={'origin'} onResponse={() => {
      this.setState(state => ({ request: !state.request }))
    }}>
      {({ fetching, failed, data }) => {
        
      if (fetching) {
        console.log(barcode)
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

  _lastTenRes = (array) => {
    const [first, ...rest] = array;
    const lastArray = rest.slice(-10);
    return lastArray;
  }

  _onChange = (res) => {
      
  }

  _renderInput = (res) => {
    let barcodeLen = res.length;
    let lastResult = null;

    if (barcodeLen){
      const lastRes = this._lastTenRes(res.map(item => { return item.codeResult.code}));

      res.map((barcode, i) => { if (barcodeLen === i + 1) { lastResult = barcode; } });
      return <div  id="myDiv" style={style.resBox}>
                <div style={style.flexBox}>
                  <ul>{lastRes.map((item, index) => <li key={index.toString()}>{item}</li>)}</ul>
                </div>
                <div style={style.flexBox}>
                  <p>{lastResult.codeResult.code}[{lastResult.codeResult.format}]</p>
                  <input id="myInput" onChange={this._onChange(lastResult)}></input><button className="btn-1" onClick={() => this.handleClic(lastResult)}>{this.state.request ? 'Выполняется запрос...' : 'Запросить'}</button>{this.state.request ? this._HTTPRequest(this.state.barcode): null}
                </div>
              </div>
    } else {
      return <div id="myDiv" style={style.resBox}><p style={style.someText}>"Нет сканированных кодов"</p><input id="myInput"></input><button className="btn-1">Запросить</button>{this.state.request ? this._HTTPRequest(this.state.barcode): null}</div>
    }
  }

  render() {
    return ( 
      this._renderInput(this.props.result)
    )
  }
}

export default Result