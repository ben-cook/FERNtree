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

      <Typography variant="h6" paragraph>
        {`You've been using Ferntree since `}
        <Typography variant="h6" display={"inline"} color="primary">
          2021
        </Typography>
        {`.`}
      </Typography>

      <Typography variant="h6" paragraph>
        {`You've earned `}
        <Typography variant="h6" display={"inline"} color="primary">
          $0
        </Typography>
        {` so far.`}
      </Typography>

      <Typography variant="h6" paragraph>
        {`You have `}
        <Typography variant="h6" display={"inline"} color="primary">
          50
        </Typography>
        {` clients under `}
        <Typography variant="h6" display={"inline"} color="primary">
          0
        </Typography>
        {` categories.`}
      </Typography>
    </>
  );
};

export default Dashboard;
