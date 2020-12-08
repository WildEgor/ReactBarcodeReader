import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";

import GlobalContext from '../../Context/GlobalContext';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { IOSSwitch, styles } from "./NavBarStyle"

class CustomToolBar extends React.Component {
  state = {
    achorEl: false,
    MobileMoreAnchorEl: false
  };

  handleProfileMenuOpen = event => {
    this.setState({
      achorEl: event.currentTarget
    });
  };

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null
    });
  };

  handleMenuClose = () => {
    this.setState({
      achorEl: null,
      mobileMoreAnchorEl: null
    });
  };

  handleMobileMenuOpen = event => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget
    });
  };

  render() {
    const { classes } = this.props;
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
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
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.openDrawerHandler}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              ControlLink
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
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
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>  
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
      </div>
    );
  }
}

export default withStyles(styles)(CustomToolBar);