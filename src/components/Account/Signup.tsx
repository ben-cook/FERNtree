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
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5)
    },
    subtitle: {
      marginTop: theme.spacing(6)
    },
    link: {
      color: theme.palette.primary.main
    },
    form: {
      marginTop: theme.spacing(6)
    },
    submitButton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  })
);

const Signup = () => {
  const classes = useStyles();
  const history = useHistory();

  const initialValues: FormValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  };

  return (
    <>
      <Typography variant="h2" className={classes.title}>
        Create an account.
      </Typography>
      <Typography variant="h5" className={classes.subtitle}>
        Please register to use Ferntree CRM.
      </Typography>

      <Formik
        enableReinitialize
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
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              history.push("/");
            })
            .catch((reason) => console.error(reason))
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <Field
                  component={TextField}
                  variant={"outlined"}
                  label={"First Name"}
                  name={"firstName"}
                  type={"text"}
                  placeholder={"First Name"}
                />
              </Grid>
              <Grid item>
                <Field
                  component={TextField}
                  variant={"outlined"}
                  label={"Family Name"}
                  name={"lastName"}
                  type={"text"}
                  placeholder={"Family Name"}
                />
              </Grid>
            </Grid>
            <Grid container direction="row" spacing={2}>
              <Grid item>
                <Field
                  component={TextField}
                  variant={"outlined"}
                  label={"Email"}
                  name={"email"}
                  type={"text"}
                  placeholder={"Email"}
                />
              </Grid>
              <Grid item>
                <Field
                  component={TextField}
                  variant={"outlined"}
                  label={"Password"}
                  name={"password"}
                  type={"password"}
                  placeholder={"Password"}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type={"submit"}
              disabled={isSubmitting}
              onClick={() => firebase.auth().signOut()}
              className={classes.submitButton}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <Typography variant="subtitle1" color="primary">
        <Link to="/account" className={classes.link}>
          Already have an account?
        </Link>
      </Typography>
    </>
  );
};

export default Signup;
