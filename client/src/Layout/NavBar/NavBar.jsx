import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import GlobalContext from '../../Context/GlobalContext';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const Home = () => {
  const IOSSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#ffc107',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });

  return (
   <nav className="NavBar-Wrapper">
     <div>
       <h3 className="NavBar-Title">Control Link</h3>
     </div>
     <div className="NavBar-Links">
     <GlobalContext.Consumer>
     {({isToggle, setToggle}) => (
        <FormControlLabel
        control={<IOSSwitch checked={isToggle} onChange={() => {
          setToggle(!isToggle)
          }} name="checkedB" />}
        label="Сканнер"
        />
      )}
      </GlobalContext.Consumer>
      <Link to="/" className="NavBar-Link">Таблица</Link>
      <Link to="/add" className="NavBar-Link">Добавить</Link>
     </div>
   </nav>
  );
};

export default Home;
