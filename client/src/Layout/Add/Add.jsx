import React, { Fragment, useState } from 'react';
import AddStudent from '../../components/AddStudent/AddStudent';

const Add = props => {
  return (
    <Fragment>
      <AddStudent location={props.location}/>
    </Fragment>
  );
};

export default Add;