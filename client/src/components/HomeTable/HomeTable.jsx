import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import ItemRow from './ItemRow'

import { PropagateLoader } from 'react-spinners';

const useStyles = makeStyles({
    root: {
        width: "100%"
    },
    container: {
        width: "80%",
        maxHeight: 440
    }
  });

  const HomeTable = props => {
    const classes = useStyles();
    const [columns, setColumns] = useState([])

    useEffect(() => {
        console.log('TABLE', props.table)
        let firstRow = props.table[0]
        let arr = []
        for (let prop in firstRow){
            if (!prop.startsWith("_")){
                if (typeof firstRow[prop] == "number"){
                    arr.push({
                        id: prop,
                        label: prop.toUpperCase(),
                        minWidth: 170,
                        align: "center",
                        format: (value) => value.toFixed(2) 
                    })
                } else {
                    arr.push({
                        id: prop,
                        label: prop.toUpperCase(),
                        minWidth: 170,
                        align: "center",
                        format: (value) => value.toLocaleString("en-US")
                    })
                }
            }
        }

        arr.unshift({
            id: "changer",
            label: "Change / Delete",
            minWidth: 170,
        })

        setColumns(oldCol => {
            let newCol = [...oldCol]
            newCol.splice(0, newCol.length, ...arr)
            return newCol
        })
        
    }, [props.table])

    return (
        <Fragment>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                        {
                        columns.map((column) => (
                        <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        >
                        {column.label}
                        </TableCell>
                        ))}    
                        </TableRow>    
                    </TableHead>
                    <TableBody>
                    {
                        props.table ? 
                            <ItemRow data ={props.table} col={columns} removeItem={props.removeItem}/>
                            : <div className="Spinner-Wrapper"> <PropagateLoader color={'#333'} /> </div>
                    }
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment>
    )
  }

  export default HomeTable