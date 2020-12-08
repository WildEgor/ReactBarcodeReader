import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  List,
  Divider
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";

import ListItemLink from './ListIremList'

import { styles } from "./NavBarStyle"

const CustomNavBar = props => {
    const [left, setLeft] = useState(false)
    const { classes, toggleDrawerHandler} = props;

    const sideList = side => (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawerHandler}
        onKeyDown={toggleDrawerHandler}
      >
        <List>
          <ListItemLink icon={ <InboxIcon /> } primary={"Добавить"} to={"/add"}></ListItemLink>
          <ListItemLink icon={ <InboxIcon /> } primary={"Таблица"} to={"/"}></ListItemLink>
        </List>
        <Divider />
      </div>
    )

    return (
      <Drawer open={props.left} onClose={props.toggleDrawerHandler}>
        {sideList("left")}
      </Drawer>
    );
  }

export default withStyles(styles)(CustomNavBar);
