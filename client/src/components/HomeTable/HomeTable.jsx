import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

import ItemRow from './ItemRow'
import EnhancedHomeTableHead from './EnhancedHomeTableHead'

import { PropagateLoader } from 'react-spinners';

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        width: "100%",
        maxHeight: 800
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    headCell: {
        backgroundColor: "rgb(0, 121, 107)",
        color: "white",
        fontSize: "1rem"
    }
  });

  const HomeTable = props => {
    const classes = useStyles();
    const [columns, setColumns] = useState([])

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');

    const toNormalLabel = (propLabel) => {
        const label = propLabel
        const labelList = {
            articul: 'Артикул',
            desc: 'Краткое описание',
            countall: 'Всего',
            sold: 'Продано',
            remind: 'Остаток',
            notes: 'Примечание'
        }

        for(let prop in labelList) {
            if (label.toLowerCase() == prop)
                return labelList[prop]
        }
    }

    useEffect(() => {
        if (typeof props.table !== "undefined"){
            let firstRow = props.table[0]
            let arr = []
            for (let prop in firstRow){
                if (!prop.startsWith("_")){
                    if (typeof firstRow[prop] == "number"){
                        arr.push({
                            id: prop,
                            label: toNormalLabel(prop),
                            minWidth: 170,
                            align: "center",
                            format: (value) => value.toFixed(2) 
                        })
                    } else {
                        arr.push({
                            id: prop,
                            label: toNormalLabel(prop),
                            minWidth: 170,
                            align: "center",
                            format: (value) => value.toLocaleString("en-US")
                        })
                    }
                }
            }

            arr.unshift({
                id: "changer",
                label: "Действие",
                minWidth: 170,
            })

            setColumns(oldCol => {
                let newCol = [...oldCol]
                newCol.splice(0, newCol.length, ...arr)
                return newCol
            })
    }
    }, [props.table])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Fragment>
            <TableContainer className={classes.container} component={Paper}>
                <Table stickyHeader aria-label="sticky table" size="large">
                    <EnhancedHomeTableHead 
                      classes={classes}
                      headCells={columns}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}  
                    />
                    <TableBody>
                    {
                        props.table ? 
                            <ItemRow data={props.table} col={columns} removeItems={props.removeItems} order={order} orderBy={orderBy}/>
                            : <div className="Spinner-Wrapper"> <PropagateLoader color={'#333'} /> </div>
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
  }

  export default HomeTable