import React, { Component } from 'react'
import { Fetch } from 'react-request';
import style from './ResultStyles.js';

class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // Эта привязка обязательна для работы `this` в колбэке.
    this.handleClick = this.handleClick.bind(this);
  }

  state = {
    barcode: 1234567,
    request: false,
    result: null
  }

  handleClick() {
    this.setState(state => ({
      request: !state.request
    }));
  }

  _HTTPRequest = (barcode) => {
    return (
      <Fetch url="https://api.openweathermap.org/data/2.5/weather?q=Almaty&appid=eb6132ec7333f86c5e9bed005c6ac9fc&units=metric">
    {({ fetching, failed, data }) => {
      if (fetching) {
        console.log('Loading data...')
        return <div>Loading data...</div>;
      }

      if (failed) {
        console.log('The request did not succeed.')
        return <div>The request did not succeed.</div>;
      }

      if (data) {
        this.setState(state => ({
          request: !state.request
        }));
        return (
          console.log(data)
        );
      }

      return null;
    }}
    </Fetch>
    )
  }

  _onChange = (res) => {
      if (res !== null || res !== undefined) {
        document.querySelector('#myInput').value = res.codeResult.code;
        this.state.barcode = res.codeResult.code;
        return res;
      }
  }

  _renderInput = (res) => {
    let barcodeLen = res.length;
    let lastResult = null;

    res.map((barcode, i) => {
      if ((barcodeLen === i + 1)) {
        lastResult = barcode;
      }
    })

    if (lastResult !== null || lastResult != undefined) {
      return <div  id="myDiv" style={style.resBox}>
        <p>{this._onChange(lastResult).codeResult.code}[{this._onChange(lastResult).codeResult.format}]</p>
        <input id="myInput" onChange={this._onChange(lastResult)}></input><button className="btn-1" onClick={this.handleClick}>{this.state.request ? 'Выполняется запрос...' : 'Запросить'}</button></div>
    } else {
      return  <div id="myDiv" style={style.resBox}>
        <p>"Нет сканированных кодов"</p>
        <input id="myInput"></input><button className="btn-1" onClick={this.handleClick}>{this.state.request ? 'Выполняется запрос...' : 'Запросить'}</button>{this.state.request ? this._HTTPRequest(this.state.barcode) : null}</div>
    }
  }

  render() {
    return ( 
      this._renderInput(this.props.result)
    )
  }
}

export default Result
