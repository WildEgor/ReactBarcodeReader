import React, { Component } from 'react'
import { Fetch } from 'react-request';
import style from './ResultStyles.js';

class Result extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      request: false
    };

    // Эта привязка обязательна для работы `this` в колбэке.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({ request: !state.request }));
  }

  _HTTPRequest = () => {
    return (
    <Fetch url="https://jsonplaceholder.typicode.com/todos/1">
      {({ fetching, failed, data }) => {
        
      if (fetching) {
        console.log('Loading data...')
        return <div>Loading data...</div>;
      }

      if (failed) {
        console.log('The request did not succeed.')
        setTimeout( () => {this.setState(state => ({ request: !state.request }))}, 100)
        return <div>The request did not succeed.</div>;
      }

      if (data) {
        setTimeout( () => {this.setState(state => ({ request: !state.request }))}, 100)
        return (
          console.log(data)
        );
      }

      return <div></div>;
    }}
    </Fetch>
    )
  }

  _onChange = (res) => {
      document.querySelector('#myInput').value = res.codeResult.code;
  }

  _renderInput = (res) => {
    let barcodeLen = res.length;
    let lastResult = null;

    res.map((barcode, i) => { if (barcodeLen === i + 1) { lastResult = barcode; } })
    
    if (lastResult != null || lastResult != undefined) {
      return <div  id="myDiv" style={style.resBox}><p>{lastResult.codeResult.code}[{lastResult.codeResult.format}]</p><input id="myInput" onChange={this._onChange(lastResult)}></input><button className="btn-1" onClick={() => this.handleClick()}>{this.state.request ? 'Выполняется запрос...' : 'Запросить'}</button>{this.state.request ? this._HTTPRequest(): null}</div>
    } else {
      return <div id="myDiv" style={style.resBox}><p style={style.someText}>"Нет сканированных кодов"</p><input id="myInput"></input><button className="btn-1">Запросить</button></div>
    }
  }

  render() {
    return ( 
      this._renderInput(this.props.result)
    )
  }
}

export default Result
