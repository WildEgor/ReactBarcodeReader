import React, { Fragment, useState } from "react";
import { Switch, Route } from "react-router-dom";
import GlobalContext from "../Context/GlobalContext"

// Components
import Home from "../Layout/Home/Home";
import NavBar from "../Layout/NavBar/NavBar";
import Add from "../Layout/Add/Add";
import Edit from "../Layout/Edit/Edit";

const Routes = () => {
  const [isToggle, setToggle] = useState(false)

  return (
    <Fragment>
      <GlobalContext.Provider value={{isToggle, setToggle}}>
        <NavBar />
        <Switch>
          <Route path="/" component={ Home } exact />
          <Route path="/add" component={ Add } exact />
          <Route path="/edit" component={ Edit } exact />
        </Switch>
      </GlobalContext.Provider>
      </Fragment>
  );
};

export default Routes;
