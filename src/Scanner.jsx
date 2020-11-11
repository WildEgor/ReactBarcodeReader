import React, { Component } from 'react'
import Quagga from 'quagga'

class Scanner extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      funcCode: 'code_128_reader',
      patchSize: 'x-small'
    };
  }

  componentDidMount() {
    this._UpdateScanner(this.state.funcCode, this.state.patchSize)
    console.log(this.state.funcCode)
    console.log(this.state.patchSize)
    Quagga.onDetected(this._onDetected)
    Quagga.onProcessed(this._onProcessed)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
  }

  shouldComponentUpdate(nextProps, nextState){
    let curFuncCode = this.state.funcCode;
    let curPatchSize = this.state.patchSize;
    let newFuncCode = this.props.config.funcCode;
    let newPatchSize = this.props.config.patchSize;

    if((curFuncCode != newFuncCode) && (curPatchSize != newPatchSize)){

      console.log("UPDATE")
      this.setState({funcCode: newFuncCode})
      this.setState({patchSize: newPatchSize})
      console.log(newFuncCode)
      console.log(newPatchSize)
      console.log(this.state.funcCode)
      console.log(this.state.patchSize)
      Quagga.stop()
      this._UpdateScanner(newFuncCode, newPatchSize)
      return true
    }
    return false
  }

  _UpdateScanner = (readerType, patchSize) => {
    if ((readerType != null || readerType != undefined) && (patchSize != null || patchSize != undefined)){
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 1280,
              height: 200,
              facingMode: 'enviroment', // or user
            },
          },
          locator: {
            patchSize: patchSize,
            halfSample: false,
          },
          numOfWorkers: 2,
          decoder: {
            readers: [readerType],
          },
          locate: true,
          frequency: 5
        },
        function(err) {
          if (err) {
            return false
          }
          Quagga.start()
        },
      )
    }
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
    return <div id="interactive" className="viewport" />
  }
}

export default Scanner