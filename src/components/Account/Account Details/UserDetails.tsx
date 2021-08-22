import Dashboard from "./Dashboard";
import DeleteAccountButton from "./DeleteAccountButton";
import {
  Button,
  Typography,
  createStyles,
  makeStyles,
  Grid
} from "@material-ui/core";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
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
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2)
    },
    form: {
      marginTop: theme.spacing(8)
    },
    submitButton: {
      marginTop: theme.spacing(2)
    }
  })
);

const UserDetails = (user: firebase.User) => {
  const classes = useStyles();

  const initialValues: FormValues = {
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <Typography variant="h4" className={classes.title}>
            Account Details
          </Typography>
          <Typography variant="h6" className={classes.subtitle}>
            {`You're logged in as ${user.email}`}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => firebase.auth().signOut()}
          >
            Sign Out
          </Button>
          <DeleteAccountButton />

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

              console.log("submitted");
            }}
          >
            {({ isSubmitting }) => (
              <Form className={classes.form}>
                <Typography variant="h6" className={classes.subtitle}>
                  User Profile
                </Typography>
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
                  Update Details
                </Button>
              </Form>
            )}
          </Formik>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Dashboard {...user} />
        </Grid>
      </Grid>
    </>
  );
};

export default UserDetails;
