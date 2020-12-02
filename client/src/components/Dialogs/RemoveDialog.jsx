import React from 'react';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    '&:hover': {
        backgroundColor: "red",
    }
  },
}));

export default function RemoveDialog(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = e => {
    let answer = e.target.textContent.toString()
    if (answer.localeCompare("Да")? false: true){
        props.onRemove(props.item._id)
        console.log('Remove')
    }
    setOpen(false);
  };

  return (
    <div>
      <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            startIcon={<DeleteIcon />}
            onClick={handleClickOpen}
          >
          Удалить
        </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{` Товар - Артикул: ${props.item.articul}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Удалить выбранный товар?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button name="No" onClick={handleClose} color="primary">Нет</Button>
          <Button name="Yes" onClick={handleClose} color="primary" autoFocus>Да</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}