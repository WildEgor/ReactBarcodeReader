import React, { Fragment, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CreateIcon from '@material-ui/icons/Create';

import { Link } from 'react-router-dom';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  },
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
    }
}));

const ChangeDialog = props => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [item, setItem] = React.useState('');
    const[itemLs, setItemLs] = React.useState(
        <MenuItem value={10}></MenuItem>
    );

  const handleClose = e => {
    props.onShow(false)
    setOpen(false)
  };

  const handleChange = (event) => {
    setItem(event.target.value);
  };

  const renderMenuItems = () => {
    const listItems = props.itemsList.map((item) => {
        return(
            <MenuItem value={item._id} key={item._id.toString()}>{item.articul} | {item.desc}</MenuItem>
        )
    });
    setItemLs(listItems)
    console.log(listItems)
  }

  useEffect(() => {
    renderMenuItems()
  }, [])

  const defaultProps = {
    color: 'secondary',
    children: <ReceiptIcon />,
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Изменить запись`}</DialogTitle>
        <DialogContent>
          <Badge className={classes.margin} color="primary" badgeContent={Array.from(props.itemsList).length} max={999} {...defaultProps} />
          <DialogContentText id="alert-dialog-description">
            {`Выбрать запись:`}
          </DialogContentText>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={item}
            defaultValue={item[0]}
            onChange={handleChange}
            >
            {
                itemLs
            }
            </Select>
        </DialogContent>
        <DialogActions>
        <Link to={{ pathname: '/edit', search: item.toString() }}>
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
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ChangeDialog