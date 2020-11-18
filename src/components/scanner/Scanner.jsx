import React, { useEffect, useState } from 'react'
import Quagga from 'quagga'

const Scanner = props => {
  const [config, setConfig] = useState(
    {
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#myScanner'),   // Or '#yourElement' (optional)
        constraints: {
          width: 800,
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
  )

  const [_Updater, setUpdater] = useState(true)

  const configSettings = () => {
    return config
  }

  const _UpdateScanner = () => {
    setUpdater(!_Updater)
    console.log('UPDATED');
    console.log(config)
    Quagga.init(
      configSettings(),
      function(err) {
        if (err) {
        } else {
          Quagga.start()
        }
      },
    )
  }

  const _onProcessed = result => {
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

  const _onDetected = result => {
      props.onDetected(result)
  }

  const _shouldComponentUpdate = () => {
    console.log("UPDATE PROCESS START!")
    console.log(config)

    setConfig(oldObject => {
      const newObject = { ...oldObject };
      newObject.locator.patchSize = props.config.patchSize;
      newObject.decoder.readers = props.config.funcCode;
      newObject.frequency = props.config.freqSpeed;
    return newObject;
    })

    Quagga.stop();
    _UpdateScanner();
  }

  useEffect(() => {
    const _Update_ = _Updater ? _UpdateScanner() : false;

    if (props.config !== undefined) {
      if(/*(props.config.funcCode != config.decoder.readers[0]) || */(props.config.patchSize != config.locator.patchSize) || (props.config.freqSpeed != config.frequency)){
        console.log('THIS IS MY PROP', props.config);
        _shouldComponentUpdate();
      }
  }
    Quagga.onDetected(_onDetected);
    Quagga.onProcessed(_onProcessed);
    return () => {
      Quagga.offDetected(_onDetected);
    }
  })

  return (
    <div id="interactive" className="viewport"/>
  );
}

export default Scanner