import React, { Component } from 'react'
import Quagga from 'quagga'

class Scanner extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      config: {
        inputStream : {
          name : "Live",
          type : "LiveStream",
          target: document.querySelector('#myScanner'),   // Or '#yourElement' (optional)
          constraints: {
            width: 1920,
            height: 200,
            facingMode: 'enviroment', // or user
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: false,
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['code_39_reader'],
        },
        locate: true,
        frequency: 1
      }
    };
  }

  configSettings = () => {
    return this.state.config
  }

  componentDidMount() {
    this._UpdateScanner()
    Quagga.onDetected(this._onDetected)
    Quagga.onProcessed(this._onProcessed)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
  }

  shouldComponentUpdate(nextProps, nextState){
    let config = this.state.config;
    if((nextProps.config.funcCode !== config.decoder.readers[0]) || (nextProps.config.patchSize !== config.locator.patchSize) || (nextProps.config.freqSpeed !== config.frequency)){
      console.log("UPDATE PROCESS START!")

      let newArray = []
      newArray.pop()
      newArray.push(nextProps.config.funcCode)

      this.setState(prevState => ({
        config: {
          ...prevState.config,           // copy all other key-value pairs 
          locator: {                     // specific object 
            ...prevState.config.locator,   // copy all 
            patchSize: nextProps.config.patchSize // update value of specific key
          },
          decoder: {
            ...prevState.config.decoder,
            readers: newArray, 
          },
          frequency: nextProps.config.freqSpeed
        }
      }))

      console.log('NEW DATA');
      console.log(this.state.config.decoder.readers[0])
      console.log(this.state.config.locator.patchSize)
      console.log('UP...');
      
      Quagga.stop()
      this._UpdateScanner()
      return true
    } else {
      return false
    }
  }

  _UpdateScanner = () => {
      console.log('UPDATED');
      console.log(this.state);
      Quagga.init(
        this.configSettings(),
        function(err) {
          if (err) {
          } else {
            Quagga.start()
          }
        },
      )
  }

  _onProcessed = result => {
    var drawingCtx = Quagga.canvas.ctx.overlay, 
        drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
          if (result.boxes) {
              drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
              result.boxes.filter(
                function (box) {
                  return box !== result.box;
              }).forEach(function (box) {
                  Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 5});
              });
          }

          if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: '00F', lineWidth: 5});
          }

          if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
          }
      }
  }

  _onDetected = result => {
      this.props.onDetected(result)
  }

  render() {
    return <div id="interactive" className="viewport"/>
  }
}

export default Scanner