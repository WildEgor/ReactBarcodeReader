import React, { Fragment, useEffect, useState } from 'react'
import Quagga from 'quagga'
import ScannerSettings from '../../components/Scanner/ScannerSettings'
import './Scanner.css'

const Scanner = props => { 
    const [config, setConfig] = useState(
      {
        inputStream : {
          name : "Live",
          type : "LiveStream",
          //target: document.getElementById('myScanner'),  
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
          readers: ['code_128_reader', 'code_39_reader', 'upc_reader', 'ean_reader'],
        },
        locate: true,
        frequency: 1
      }
    )

    const [results, setResult] = useState([]) // Текущий результат сканирования 

    const _initConfig = () => {
        return config
    }

    const _UpdateScanner = () => {
        console.log('Update Scanner...', config);
        setTimeout(() => {
            Quagga.init(
                _initConfig(),
                function(err) {
                if (err) {
                } else {
                    Quagga.start()
                }
                },
            )
        }, 1000)
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
        console.log('RESULT IS', result)
        props.onDetected(result)
        setResult( results.concat( [ result ] ) )
    }

    const _shouldComponentUpdate = configData => {
        setConfig(oldConf => {
            let newConf = {...oldConf}
            switch(configData.actionMeta.name) {
                case 'freqSpeed': 
                    newConf.frequency = configData.newValue.value
                    break;
                case 'funcCode':
                    if (configData.newValue !== null) {
                        newConf.decoder.readers = [...configData.newValue].map(a => a.value);
                    }
                    break;
                case 'patchSize': 
                    newConf.locator.patchSize = configData.newValue.value
                    break;
            }
            return newConf
        })
        try{
            Quagga.stop()
            _UpdateScanner()
        } catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
            Quagga.onDetected(_onDetected)
            Quagga.onProcessed(_onProcessed)
        return () => { 
            Quagga.offDetected(_onDetected) 
        }
    })

    useEffect(() => {
        console.log('NEW CONFIG IS: ', config)
    }, [config])

    useEffect(() => {
        _UpdateScanner()
    }, [])
    
    return (
    <Fragment>
        <div className="vieport-wrapper">
            <div id="interactive" className="viewport"/>
            <ScannerSettings updateSettings={_shouldComponentUpdate} />
        </div>
    </Fragment>
    );
}

export default Scanner