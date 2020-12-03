import React, { useEffect, useState } from 'react'
import Quagga from 'quagga'
import ScannerSettings from '../../components/Scanner/ScannerSettings'
import './Scanner.css'

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('xs')]: {
            width: "100vh",
            flexDirection: "column",
          },
          [theme.breakpoints.up('lg')]: {
            flexDirection: "row",
          },
        display: "flex",
        flexGrow: 1, 
        alignItems: "center"
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    item: {
        [theme.breakpoints.down('xs')]: {
            width: "50vh",
          },
        [theme.breakpoints.up('lg')]: {
            width: "50vh",
            },
    },
    scanner: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }
  }));

const Scanner = props => { 
    const classes = useStyles();

    const [config, setConfig] = useState(
      {
        inputStream : {
          name : "Live",
          type : "LiveStream",
          //target: document.getElementById('myScanner'),  
          constraints: {
            width: 1920,
            height: 200,
            facingMode: 'user', // or user
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: false,
        //   debug: {
        //     showCanvas: true,
        //     showPatches: true,
        //     showFoundPatches: true,
        //     showSkeleton: true,
        //     showLabels: true,
        //     showPatchLabels: true,
        //     showRemainingPatchLabels: true,
        //     boxFromPatches: {
        //       showTransformed: true,
        //       showTransformedBox: true,
        //       showBB: true
        //     }
        //   }
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['code_128_reader', 'code_39_reader', 'upc_reader', 'ean_reader'],
        },
        locate: true,
        frequency: 1,
        // debug: {
        //     drawBoundingBox: true,
        //     showFrequency: true,
        //     drawScanline: true,
        //     showPattern: true
        // }
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
            newConf.frequency = configData.freq
            newConf.decoder.readers = configData.funcCode
            newConf.locator.patchSize = configData.patchSize
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
    
        <Grid container spacing={20} className={classes.scanner}>
        <Paper elevation={3} className={classes.root}>
            <Grid item className={classes.item} lg={10} xs={12}>
                <Box className="vieport-wrapper" color="text.primary"/>
                <Box id="interactive" className="viewport"/>
            </Grid>
            <Grid item className={classes.item} lg={2} xs={12}>
                <ScannerSettings updateSettings={_shouldComponentUpdate} />
            </Grid>
        </Paper> 
    </Grid> 
    
    );
}

export default Scanner