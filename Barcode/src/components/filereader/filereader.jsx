import React, { useState, useEffect, useContext, useCallback } from 'react'
import ReactDOM from 'react-dom'
import * as XLSX from 'xlsx';
import {useDropzone} from 'react-dropzone'

const FileReader = props => {
    const [file, setFile] = useState()

    const onDrop = useCallback(acceptedFiles => {
        let fileName = acceptedFiles.name
        console.log('File', acceptedFiles[0])
      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {
            isDragActive ?
              <p>Drop the files here ...</p> :
              <p>Drag 'n' drop some files here, or click to select files</p>
          }
        </div>
      )
}

export default FileReader