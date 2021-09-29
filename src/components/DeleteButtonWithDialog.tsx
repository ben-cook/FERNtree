import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles
} from "@material-ui/core";
import { useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    red: {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText
    }
  })
);

interface Props {
  buttonText: string;
  dialogTitle: string;
  dialogContent: string;
  deleteFunction: () => void | Promise<void>;
}

const DeleteButtonWithDialog = ({
  buttonText,
  dialogContent,
  dialogTitle,
  deleteFunction
}: Props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        className={classes.red}
        onClick={handleClickOpen}
        data-cy="delete-button"
      >
        {buttonText}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Delete Account"
        aria-describedby="Delete Account"
      >
        <DialogTitle id="Delete Account">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id={dialogContent}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button
            onClick={deleteFunction}
            className={classes.red}
            autoFocus
            data-cy="confirm-delete"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButtonWithDialog;
