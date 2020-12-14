import React from 'react'
import PropTypes from 'prop-types'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

const EnhancedHomeTableHead = props => {
    const { classes, order, orderBy, onRequestSort, headCells } = props
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    }

    return (
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                className={classes.headCell}
                key={"headColumn_" + headCell.id}
                align={!headCell.numeric ? 'center' : 'right'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
              {
                headCell.id !== 'changer'? 
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
                </TableSortLabel>
                : headCell.label
              }
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      );
}

EnhancedHomeTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    headCells: PropTypes.array.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
};

export default EnhancedHomeTableHead