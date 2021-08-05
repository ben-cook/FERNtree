import { StepProps } from "./EmailLogin";
import { Grid, TextField } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as yup from "yup";

export const passwordStepValidationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
});

const useStyles = makeStyles(() =>
  createStyles({
    root: { width: "40vw", margin: "auto", marginTop: "1em" }
  })
);

const PasswordStep = ({ values, handleChange, touched, errors }: StepProps) => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      className={classes.root}
      justifyContent="center"
      alignContent="center"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item>
        <TextField
          variant="outlined"
          label="Password"
          fullWidth
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
        />
      </Grid>
    </Grid>
  );
};
export default PasswordStep;
