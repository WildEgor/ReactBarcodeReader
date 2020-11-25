import React, {useContext, useEffect} from 'react';
import FileReader from './components/filereader/filereader'

const NavigationBar = props => {

    return (
        <div>
            <FileReader></FileReader>
            <button>Save</button>
            <button>Open form</button>
            <button>Open scanner</button>
        </div>
    )
}

export default NavigationBar