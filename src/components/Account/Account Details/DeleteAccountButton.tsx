import {
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  Button,
  createStyles,
  makeStyles
} from "@material-ui/core";
import firebase from "firebase/app";
import { useState } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    red: {
      marginLeft: theme.spacing(2),
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.contrastText
    }
  })
);

const DeleteAccountButton = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const deleteAccount = () =>
    firebase
      .auth()
      .currentUser?.delete()
      .catch((err) => console.error(err));

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
        data-cy="delete-account"
      >
        Delete Account
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="Delete Account"
        aria-describedby="Delete Account"
      >
        <DialogTitle id="Delete Account">Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="Are you sure you wish to permanently delete your account?">
            Are you sure you wish to permanently delete your account? This
            action cannot be reversed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={deleteAccount} className={classes.red} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccountButton;
