import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Scanner from './Scanner'
import Result from './Result'
import './styles.css';

class App extends Component {
  state = {
    scanning: false,
    results: [],
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
        <div className="results">
          <button className="btn-1" onClick={this._scan}>
            {this.state.scanning ? 'Stop' : 'Start'}
          </button>
          {this.state.scanning ? <Scanner onDetected={this._onDetected} /> : null}
        </div>
        <div>
          <Result result = {this.state.results}/>
        </div>
      </div>
    )
  }
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
