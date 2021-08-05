import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

// CSS Styling for this component
const useStyles = makeStyles(() => ({
  form: {
    marginTop: "2em"
  },
  submitButton: {
    marginTop: "1.5em"
  }
}));

// Yup allows us to realy easily validate user input in conjunction with Formik
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required")
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  // We run this function when the user click the sign up button
  const signUp = ({ email, password }: { email: string; password: string }) => {
    const auth = firebase.auth();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        console.log(
          `Created account and signed in as ${credentials.user?.email}`
        );
        // Redirect back to the home page after the user has signed up and logged in
        history.push("/");
      })
      .catch((reason) => console.error(reason));
  };

  // Formik allows us to create forms super easily.
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      signUp(values);
    }
  });

  return (
    <Grid
      container
      alignContent={"center"}
      alignItems={"center"}
      direction={"row"}
      justifyContent={"center"}
    >
      <Grid item xs={12} sm={12} md={6}>
        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
          />

          <Button
            type="submit"
            variant={"outlined"}
            className={classes.submitButton}
          >
            Sign up
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default SignUp;
