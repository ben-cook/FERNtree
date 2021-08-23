import { Typography, createStyles, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(4)
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(16)
      }
    },
    section: {
      marginBottom: theme.spacing(2)
    }
  })
);

const Dashboard = (user: firebase.User) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" className={classes.title} paragraph>
        Dashboard
      </Typography>

      <div className={classes.section}>
        <Typography variant="h6" display={"inline"}>
          {`You've been using Ferntree since `}
        </Typography>
        <Typography variant="h6" display={"inline"} color="primary">
          2021
        </Typography>
        <Typography variant="h6" display={"inline"} paragraph>
          {`.`}
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" display={"inline"}>
          {`You've earned `}
        </Typography>
        <Typography variant="h6" display={"inline"} color="primary">
          $0
        </Typography>
        <Typography variant="h6" display={"inline"}>
          {` so far.`}
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" display={"inline"}>
          {`You have `}
        </Typography>
        <Typography variant="h6" display={"inline"} color="primary">
          0
        </Typography>
        <Typography variant="h6" display={"inline"}>
          {` clients under `}
        </Typography>
        <Typography variant="h6" display={"inline"} color="primary">
          0
        </Typography>
        <Typography variant="h6" display={"inline"}>
          {` categories.`}
        </Typography>
      </div>

      <pre>{JSON.stringify(user.email, null, 2)}</pre>
    </>
  );
};

export default Dashboard;
