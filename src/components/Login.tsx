import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography
} from "@material-ui/core";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5)
    },
    subtitle: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6)
    },
    input: {
      marginBottom: theme.spacing(2)
    },
    link: {
      color: theme.palette.primary.main
    },
    form: {
      display: "inline-grid",
      minWidth: 250
    }
  })
);

const Login = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const initialValues: FormValues = {
    email: "",
    password: ""
  };

  const signInWithGoogle = () => {
    const google_provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(google_provider)
      .then((re)=> {
        console.log(re);
      })
      .catch((err)=> {
        console.log(err);
      })
  }

  return (
    <>
      <Typography variant="h2" className={classes.title}>
        Welcome back to Ferntree!
      </Typography>
      <Typography variant="h5" className={classes.subtitle}>
        Please log in to access your contacts.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Please enter a valid email address.")
            .required("Please enter your email address."),
          password: Yup.string().required("Please enter your password.")
        })}
        onSubmit={(
          values: FormValues,
          { setSubmitting }: FormikHelpers<FormValues>
        ) => {
          setSubmitting(true);

          const { email, password } = values;
          const auth = firebase.auth();

          auth
            .signInWithEmailAndPassword(email, password)
            .catch((reason) => {
              console.error(reason);
              enqueueSnackbar("Incorrect username or password.", {
                variant: "error"
              });
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <Field
              component={TextField}
              variant={"outlined"}
              label={"Email"}
              name={"email"}
              type={"text"}
              placeholder={"Email"}
              className={classes.input}
              data-cy="email"
            />
            <Field
              component={TextField}
              variant={"outlined"}
              label={"Password"}
              name={"password"}
              type={"password"}
              placeholder={"Password"}
              className={classes.input}
              data-cy="password"
            />
            <Grid container direction={"row"}>
              <Grid item xs={5}>
                <Button
                  type={"submit"}
                  variant={"contained"}
                  color={"primary"}
                  disabled={isSubmitting}
                  className={classes.input}
                  data-cy="submit"
                >
                  Log In
                </Button>
              </Grid>
              <Grid item xs={7}>
                <Button
                  //type={"submit"}
                  onClick={signInWithGoogle}
                  variant={"contained"}
                  color={"primary"}
                  disabled={isSubmitting}
                  className={classes.input}
                  data-cy="submit">
                    Google Sign In
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      <Typography variant="subtitle1" color="primary">
        New to Ferntree CRM?{" "}
        <Link to="/signup" className={classes.link} data-cy="signup-link">
          Create an account.
        </Link>
      </Typography>
    </>
  );
};

export default Login;
