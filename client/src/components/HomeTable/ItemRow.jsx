import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';

import { Link } from 'react-router-dom';
import RemoveDialog from '../Dialogs/RemoveDialog'

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        '&:hover': {
          backgroundColor: "purple",
      }
    }
  }));

  const ItemRow = props => {
    const classes = useStyles();

    const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) {
          return -1;
      }
      if (b[orderBy] > a[orderBy]) {
          return 1;
      }
      return 0;
    }
    
    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        
        return stabilizedThis.map((el) => el[0]);
    }

    return (
      <Fragment>
      {stableSort(props.data, getComparator(props.order, props.orderBy))
        //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map(rows => {
          return (
            <TableRow tabIndex={-1} key={rows._id}>
              {
                  props.col.map((column) => {
                      const value = rows[column.id];
                      if (column.id == "changer"){
                          return (
                          <TableCell key={rows._id} align={"right"}>
                            <RemoveDialog onRemove ={props.removeItem} item={rows}></RemoveDialog>
                            <Link to={{ pathname: '/edit', search: rows._id }}>
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
                          </TableCell>
                          )
                      } else {
                          return (
                          <TableCell key={"column_" + column.id} align={column.align}>
                              {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                          ); 
                      }
                  })
              }
            </TableRow>
          );
        })
      }
      </Fragment>
    )
  }

  export default ItemRow