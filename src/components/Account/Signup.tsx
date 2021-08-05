import Loading from "../Loading";
import { Button, Grid, TextField, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";
import { Form, Formik } from "formik";
import { useHistory } from "react-router-dom";
import * as yup from "yup";

// CSS Styling for this component
const useStyles = makeStyles(() => ({
  form: {
    marginTop: "2em"
  },
  submitButton: {
    marginTop: "1.5em"
  },
  emailField: {
    marginBottom: "1em",
    marginTop: "1em"
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

// Type the form values
interface FormValues {
  email: string;
  password: string;
}

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();

  const initialFormValues: FormValues = { email: "", password: "" };

  // We run this function when the user click the sign up button
  const signUp = ({ email, password }: FormValues) => {
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

  return (
    <Grid
      container
      alignContent={"center"}
      alignItems={"center"}
      direction={"row"}
      justifyContent={"center"}
    >
      <Grid item xs={12} sm={12} md={6}>
        <Formik
          initialValues={initialFormValues}
          validationSchema={validationSchema}
          onSubmit={signUp}
        >
          {({ isSubmitting, errors, values, handleChange, touched }) => (
            <Form>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                className={classes.emailField}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
              />

              {isSubmitting && <Loading />}

              <Button
                type="submit"
                variant={"outlined"}
                className={classes.submitButton}
              >
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default SignUp;
