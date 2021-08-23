import { User } from "../../../types";
import Loading from "../../Loading";
import {
  Button,
  Grid,
  Typography,
  createStyles,
  makeStyles
} from "@material-ui/core";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useDocumentData } from "react-firebase-hooks/firestore";
import * as Yup from "yup";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
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

const ChangeUserDetailsForm = (user: firebase.User) => {
  const classes = useStyles();

  const userDocumentReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid);

  const [data, loading] = useDocumentData<User>(userDocumentReference);

  if (loading) {
    return <Loading />;
  }

  const initialValues: FormValues = {
    email: "",
    password: "",
    firstName: data?.firstName,
    lastName: data?.lastName
  };

  return (
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

        const { firstName, lastName } = values;

        userDocumentReference
          .set({ firstName, lastName }, { merge: true })
          .catch((err) => console.error(err))
          .finally(() => setSubmitting(false));
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
            className={classes.submitButton}
          >
            Update Details
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangeUserDetailsForm;
