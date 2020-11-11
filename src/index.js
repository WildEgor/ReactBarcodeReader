import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Scanner from './Scanner'
import Result from './Result'
import Selector from './Selector'
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      myConfig: { 
        funcCode: "code_128_reader",
        patchSize: "x-small"
      },
      optionsFuncCode: [
        {value: "code_128_reader", label:"code_128"}, 
        {value: "code_39_reader", label: "code_39"},
        {value: "upc_reader", label: "upc"}
        ],
      optionsPatchSize: [
        {value: "x-small", label:"x-small"}, 
        {value: "small", label: "small"},
        {value: "medium", label: "medium"}
        ],
      results: [],
    }

    this.handleChange = this.handleChange.bind(this);
  }

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    this.setState({ results: this.state.results.concat([result]) })
  }

  handleChange(e) {
    if (e.target.name == 'decoder_readers'){
      console.log("SELECTORDECODER")
      let value = e.target.value;
      this.setState(prevState => ({
        myConfig: {                   // object that we want to update
            ...prevState.myConfig,    // keep all other key-value pairs
            funcCode: value       // update the value of specific key
        }
    }))
    }
    if (e.target.name == 'locator_patch-size'){
      console.log("SELECTORLOCATOR")
      let value = e.target.value;
      this.setState(prevState => ({
        myConfig: {                   // object that we want to update
            ...prevState.myConfig,    // keep all other key-value pairs
            patchSize: value       // update the value of specific key
        }
    }))
    }
    console.log(this.state.myConfig)
  }

  render() {
    return (
      <div className="scannerWindow">
        <button className="btn-1" onClick={this._scan}>
              {this.state.scanning ? 'Stop' : 'Start'}
        </button>
        <div className="results">
          <div>{this.state.scanning ? <Scanner config={this.state.myConfig} onDetected={this._onDetected} /> : <div>Упс... Либо нет камеры, либо нажмите кнопку выше для активации сканера</div>}</div>
          <div>{this.state.scanning ? 
          <div>
            <div>
            <label>
              <span>Barcode-Type</span>
              <select name="decoder_readers" onChange={this.handleChange}>
                {
                  this.state.optionsFuncCode.map((option, i) => ( <option key={i} value={option.value}>{option.label}</option> ))
                }
              </select>
            </label>
            <label>
                <span>Patch-Size</span>
                <select name="locator_patch-size" onChange={this.handleChange}>
                  {
                    this.state.optionsPatchSize.map((option, i) => ( <option key={i} value={option.value}>{option.label}</option> ))
                  }
                </select>
            </label>
            </div>
            </div>
            : null}</div>
        </div>
        <Result result = {this.state.results}/>
      </div>
    )
  }
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
