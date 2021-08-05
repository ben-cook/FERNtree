import EmailLogin from "./EmailLogin/EmailLogin";
import { Grid, Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

const useStyles = makeStyles(() =>
  createStyles({
    buttonGroup: { width: "20vw", margin: "auto", marginTop: "1em" }
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
      className={classes.buttonGroup}
      justifyContent="center"
      alignContent="center"
      alignItems="stretch"
      spacing={1}
    >
      <Grid item>
        <Button variant="outlined" color="default" fullWidth>
          <Typography variant="button" color="initial">
            Sign in with Google
          </Typography>
        </Button>
      </Grid>
      <Grid item>
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
  );
};

export default Login;
