import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Scanner from './Scanner'
import Result from './Result'
import Select from 'react-select'
import ExcelForm from './ReadExcel'
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      myConfig: { 
        funcCode: ["code_128_reader"],
        patchSize: "x-small",
        freqSpeed: 5
      },
      Settings: {
        optionsFuncCode: [
          {value: "code_128_reader", label:"code_128"}, 
          {value: "code_39_reader", label: "code_39"},
          {value: "upc_reader", label: "upc"},
          {value: "ean_reader", label: "ean"}
          ],
        optionsPatchSize: [
          {value: "x-small", label:"x-small"}, 
          {value: "small", label: "small"},
          {value: "medium", label: "medium"},
          {value: "large", label: "large"}
          ],
        optionsFreq: [
          {value: 1, label:"very slow"}, 
          {value: 5, label: "slow"},
          {value: 15, label: "medium"},
          {value: 20, label: "fast"}
          ]
      },
      results: [],
    }

  }

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    this.setState({ results: this.state.results.concat([result]) })
  }

  render() {
    return (
      <div className="scannerWindow">
        <button className="btn-1 btn-1-green" onClick={this._scan}>
              {this.state.scanning ? 'Stop' : 'Start'}
        </button>
        <div className="results">
          <div>{this.state.scanning ? <Scanner config={this.state.myConfig} onDetected={this._onDetected} /> : <div>Упс... Либо нет камеры, либо нажмите кнопку выше для активации сканера</div>}</div>
          <div>{this.state.scanning ? 
          <div>
            <div>
              <span>Select speed</span>
              <Select name="select_speed" options={this.state.Settings.optionsFreq} onChange={value => this.setState(prevState => ({myConfig: {...prevState.myConfig, freqSpeed: value.value}}) )}/>     
              <span>Barcode-Type</span>
              <label>
                <Select
                  defaultValue={[this.state.Settings.optionsFuncCode[0], this.state.Settings.optionsFuncCode[1]]}
                  isMulti
                  name="colors"
                  options={this.state.Settings.optionsFuncCode}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange ={value =>  {
                    this.setState( prevState => ( { myConfig: { ...prevState.myConfig, funcCode: {...['code_39_reader']} } } ) ) 
                  }}
                />
              </label>
              <span>Patch-Size</span>
              <Select name="locator_patch" options={this.state.Settings.optionsPatchSize} onChange={value => this.setState(prevState => ({myConfig: {...prevState.myConfig, patchSize: value.value}}) )}/>
            </div>
            </div>
            : null}</div>
        </div>
        <Result result = {this.state.results}/>
        <ExcelForm />
      </div>
    )
  }
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
