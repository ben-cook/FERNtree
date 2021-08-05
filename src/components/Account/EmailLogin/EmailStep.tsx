import { StepProps } from "./EmailLogin";
import { Grid, TextField } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import * as yup from "yup";

export const emailStepValidationSchema = yup.object().shape({
  email: yup.string().email("Enter a valid email").required("Email is required")
});

const useStyles = makeStyles(() =>
  createStyles({
    root: { margin: "auto", marginTop: "1em", width: "100%" }
  })
);

const EmailStep = ({ values, handleChange, touched, errors }: StepProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} justifyContent={"center"}>
      <Grid item xs={12} sm={8} md={6}>
        <TextField
          variant="outlined"
          label="Enter your email"
          fullWidth
          id="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
        />
      </Grid>
    </Grid>
  );
};
export default EmailStep;
