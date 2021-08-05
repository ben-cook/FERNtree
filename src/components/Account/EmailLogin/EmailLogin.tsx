import Loading from "../../Loading";
import EmailStep, { emailStepValidationSchema } from "./EmailStep";
import PasswordStep, { passwordStepValidationSchema } from "./PasswordStep";
import { Button, Grid } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import {
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikTouched,
  FormikValues
} from "formik";
import { useState } from "react";
import * as yup from "yup";

const useStyles = makeStyles(() =>
  createStyles({
    buttons: {},
    button: { marginTop: "1em" },
    wrapper: {},
    submitButton: {
      marginTop: "1.5em"
    },
    root: {
      width: "100%"
    }
  })
);

// These are the values that the form uses
interface FormValues {
  email: string;
  password: string;
}

// Each step component takes these values as props
export interface StepProps {
  values: FormikValues;
  handleChange: (e: React.ChangeEvent) => void;
  touched: FormikTouched<FormValues>;
  errors: FormikErrors<FormValues>;
}

// Each step in this array of steps has a step label, form schema, and a step component that belongs to it
interface Step {
  label: string;
  validationSchema: yup.AnySchema;
  component: (props: StepProps) => JSX.Element;
}

// Define the step array
const steps: Step[] = [
  {
    label: "Email Step",
    component: EmailStep,
    validationSchema: emailStepValidationSchema
  },
  {
    label: "Password Step",
    component: PasswordStep,
    validationSchema: passwordStepValidationSchema
  }
];

// Handle actually signing into the app
const handleFormSubmit = (
  values: FormValues,
  actions: FormikHelpers<FormValues>
) => {
  const { email, password } = values;
  const auth = firebase.auth();

  auth
    .signInWithEmailAndPassword(email, password)
    .then((credentials) =>
      console.log(`Signed in as ${credentials.user?.email}`)
    )
    .catch((reason) => console.error(reason))
    .finally(() => actions.setSubmitting(false));
};

interface EmailLoginProps {
  setIsEmailSelected: (b: boolean) => void;
}

const EmailLogin = ({ setIsEmailSelected }: EmailLoginProps): JSX.Element => {
  const classes = useStyles();

  const initialFormValues: FormValues = { email: "", password: "" };

  // Keep track of which step we're up to
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const incrementStepIndex = () => setCurrentStepIndex(currentStepIndex + 1);
  const decrementStepIndex = () => setCurrentStepIndex(currentStepIndex - 1);

  // Go to the next step, or submit the form if we're done
  const nextStep = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    if (currentStepIndex < steps.length - 1) {
      incrementStepIndex();
      actions.setSubmitting(false);
    } else {
      // We're done, submit the form
      handleFormSubmit(values, actions);
    }
  };

  // Go to the previous step, or back to sign in methods if we decide not to login with email
  const previousStep = () => {
    if (currentStepIndex > 0) {
      decrementStepIndex();
    } else {
      setIsEmailSelected(false);
    }
  };

  // Get the current step of the form that we're up to
  const currentStep = steps[currentStepIndex];

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={currentStep.validationSchema}
      onSubmit={nextStep}
      className={classes.root}
    >
      {({ isSubmitting, errors, values, handleChange, touched }) => (
        <Form>
          <currentStep.component
            values={values}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />

          <Grid container direction="column">
            {isSubmitting && <Loading />}

            <Grid item container justifyContent="center">
              <Grid item xs={10} sm={6} md={3}>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  fullWidth
                >
                  {currentStepIndex === steps.length - 1 ? "Sign in" : "Next"}
                </Button>
              </Grid>
            </Grid>

            <Grid item container justifyContent="center">
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  onClick={previousStep}
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default EmailLogin;
