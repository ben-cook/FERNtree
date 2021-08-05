import { Grid, Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    buttonGroup: { width: "20vw", margin: "auto", marginTop: "1em" }
  })
);

const Login = () => {
  const classes = useStyles();

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
        <Button variant="outlined" color="default" fullWidth>
          Sign in with email
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
