import EmailLogin from "./EmailLogin/EmailLogin";
import { Grid, Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      marginTop: "1em"
    }
  })
);

const Login = () => {
  const classes = useStyles();
  const [isEmailSelected, setIsEmailSelected] = useState<boolean>(false);

  if (isEmailSelected) {
    return <EmailLogin setIsEmailSelected={setIsEmailSelected} />;
  }

  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justifyContent="center"
      alignContent="center"
      alignItems="stretch"
      spacing={1}
    >
      <Grid item container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Button variant="outlined" color="default" fullWidth>
            <Typography variant="button" color="initial">
              Sign in with Google
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Grid item container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Button
            variant="outlined"
            color="default"
            fullWidth
            onClick={() => setIsEmailSelected(true)}
          >
            <Typography variant="button" color="initial">
              Sign in with email
            </Typography>
          </Button>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" color="initial">
        {`Don't have a account?`} <Link to="/signup">Sign up here</Link>
      </Typography>
    </Grid>
  );
};

export default Login;
