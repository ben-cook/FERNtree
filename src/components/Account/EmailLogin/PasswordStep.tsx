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
    root: { margin: "auto", marginTop: "1em", width: "100%" }
  })
);

const PasswordStep = ({ values, handleChange, touched, errors }: StepProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} justifyContent={"center"}>
      <Grid item xs={12} sm={8} md={6}>
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
