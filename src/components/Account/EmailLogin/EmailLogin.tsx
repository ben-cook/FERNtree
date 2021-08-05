import Loading from "../../Loading";
import EmailStep, { emailStepValidationSchema } from "./EmailStep";
import PasswordStep, { passwordStepValidationSchema } from "./PasswordStep";
import { Button } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import firebase from "firebase/app";
import {
  Form,
  Formik,
  FormikErrors,
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
const handleFormSubmit = (values: FormValues, actions) => {
  console.log("form submitted, trying to sign in now");

  const { email, password } = values;
  const auth = firebase.auth();

  auth
    .signInWithEmailAndPassword(email, password)
    .then((credentials) =>
      console.log(`Signed in as ${credentials.user?.email}`)
    )
    .catch((reason) => console.log(reason))
    .finally(() => actions.setSubmitting(false));
};

interface EmailLoginProps {
  setIsEmailSelected: (b: boolean) => void;
}

const EmailLogin = ({ setIsEmailSelected }: EmailLoginProps): JSX.Element => {
  const classes = useStyles();

  // Keep track of which step we're up to
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const incrementStepIndex = () => setCurrentStepIndex(currentStepIndex + 1);
  const decrementStepIndex = () => setCurrentStepIndex(currentStepIndex - 1);

  // Go to the next step, or submit the form if we're done
  const nextStep = (values: FormValues, actions) => {
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

  // Get the currest step of the form that we're up to
  const currentStep = steps[currentStepIndex];

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={currentStep.validationSchema}
      onSubmit={nextStep}
    >
      {({ isSubmitting, errors, values, handleChange, touched }) => (
        <Form>
          <currentStep.component
            values={values}
            handleChange={handleChange}
            errors={errors}
            touched={touched}
          />

          <div className={classes.buttons}>
            <div className={classes.wrapper}>
              {isSubmitting && <Loading />}
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                {currentStepIndex === steps.length - 1 ? "Sign in" : "Next"}
              </Button>
            </div>

            <Button
              onClick={previousStep}
              className={classes.button}
              variant="contained"
              color="primary"
            >
              Back
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmailLogin;
