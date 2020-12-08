import React, { Fragment, useState } from 'react';

import CustomToolBar from "./CustomToolBar";
import CustomNavBar from "./CustomNavBar";

const Home = () => {
  const [leftSide, setLeftSide] = useState(false)

  const toggleDrawer = () => {
    // if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
    //   return;
    // }

    setLeftSide(false);
  };

  const openDrawer = () => {
    setLeftSide(true);
  };

  return (
    <Fragment>
    <CustomToolBar openDrawerHandler={ openDrawer } />
    <CustomNavBar
      left={ leftSide }
      toggleDrawerHandler={ toggleDrawer }
    />
    </Fragment>
  );
};

export default Home;
