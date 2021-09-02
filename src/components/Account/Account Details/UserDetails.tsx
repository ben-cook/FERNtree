import { User } from "../../../types";
import ChangeUserDetailsForm from "./ChangeUserDetailsForm";
import Dashboard from "./Dashboard";
import DeleteAccountButton from "./DeleteAccountButton";
import {
  Button,
  Typography,
  createStyles,
  makeStyles,
  Grid
} from "@material-ui/core";
import firebase from "firebase/app";
import { useDocumentData } from "react-firebase-hooks/firestore";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5)
    },
    subtitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2)
    },
    form: {
      marginTop: theme.spacing(8)
    },
    submitButton: {
      marginTop: theme.spacing(2)
    }
  })
);

const UserDetails = (user: firebase.User) => {
  const classes = useStyles();

  const userDocumentReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid);

  const [data, loading] = useDocumentData<User>(userDocumentReference);

  return (
    <Grid container>
      <Grid item xs={12} sm={7}>
        <Typography variant="h4" className={classes.title}>
          Account Details
        </Typography>
        {!loading && (
          <Typography variant="h6" className={classes.subtitle}>
            {`You're logged in as ${data?.firstName} ${data?.lastName}.`}
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => firebase.auth().signOut()}
          data-cy="logout"
        >
          Sign Out
        </Button>

        <DeleteAccountButton />

        <ChangeUserDetailsForm {...user} />
      </Grid>

      <Grid item xs={12} sm={5}>
        <Dashboard {...user} />
      </Grid>
    </Grid>
  );
};

export default UserDetails;
