import React, { Component, Fragment } from 'react';
import Routes from './Routes/Routes';
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline />
        <Routes />
      </Fragment>
    );
  }
}

export default App;