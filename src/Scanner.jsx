import React, { Component } from 'react'
import Quagga from 'quagga'

class Scanner extends Component {
  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 1280,
            height: 720,
            facingMode: 'enviroment', // or user
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: false,
        },
        numOfWorkers: 2,
        decoder: {
          readers: [
            //'code_128_reader',
            //'ean_reader',
            //'ean_8_reader',
            'code_39_reader',
            //'code_39_vin_reader'
            //'codabar_reader'
            //'upc_reader',
            //'upc_e_reader'
            //'i2of5_reader',
            //'2of5_reader',
            //'code_93_reader'
          ],
        },
        locate: true,
        frequency: 5
      },
      function(err) {
        if (err) {
          return console.log(err)
        }
        Quagga.start()
      },
    )
    Quagga.onDetected(this._onDetected)
    Quagga.onProcessed(this._onProcessed)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
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