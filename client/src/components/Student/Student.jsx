import React from 'react';
import './Student.css';
import { Link } from 'react-router-dom';
import RemoveDialog from '../Dialogs/RemoveDialog'

import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    '&:hover': {
      backgroundColor: "green",
  }
  },
}));

const Student = ({ _id, articul, desc, countAll, sold, remind, notes, removeStudent }) => {
  const classes = useStyles();

  return(
    <tr>
      <td>{ articul }</td>
      <td>{ desc }</td>
      <td>{ countAll }</td>
      <td>{ sold }</td>
      <td>{ remind }</td>
      <td>{ notes }</td>
      <td>
        <RemoveDialog onRemove ={removeStudent} item={{_id, articul, desc, countAll, sold, remind, notes}}></RemoveDialog>
        <Link to={{ pathname: '/edit', search: _id }}>
        <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<CreateIcon />}
          >
          Изменить
          </Button>
        </Link>
      </td>

    </tr>
  );
};

export default Student;
