import React from 'react';
import './Student.css';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar';

const Student = ({ _id, articul, desc, countAll, sold, remind, notes, removeStudent }) => {
  return(
    <tr>
      <td>{ articul }</td>
      <td>{ desc }</td>
      <td>{ countAll }</td>
      <td>{ sold }</td>
      <td>{ remind }</td>
      <td>{ notes }</td>
      <td>
        <button onClick={ () => removeStudent(_id) } className="Action-Button fa fa-trash"></button>
        <Link to={{ pathname: '/edit', search: _id }}>
         <button className="Action-Button fa fa-pencil"></button>
        </Link>
      </td>

    </tr>
  );
};

export default Student;
