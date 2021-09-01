import {
  Typography,
  makeStyles,
  createStyles,
  Button,
  Grid,
  Box,
  MenuItem
} from "@material-ui/core";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useState } from "react";
import { useParams, matchPath, useLocation } from "react-router-dom";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  business: string;
  address: string;

  category: string;

  email: string;
  phone: string;

  payRate: string;
  jobStatus: "Not Started" | "In Progress" | "Completed";

  notes: string;

  [customField: string]: string | number;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(2)
    },
    submitButton: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3)
    }
  })
);

const Client = () => {
  const classes = useStyles();
  //temp dummy array to emulate category 'fields' (attribute of category object)
  const category = ["customField1", "customField2", "customField3"];

  // Here we generate initialValues object for the custom categories to satisfy the
  // react uncontrolled to controlled input error, using a bit of functional programming magic :D
  const categoryInitialValues = category.reduce((acc, cur) => {
    acc[cur] = "";
    return acc;
  }, {});

  console.log(categoryInitialValues);

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    business: "",
    address: "",
    category: "",
    email: "",
    phone: "",
    payRate: "",
    jobStatus: "Not Started",
    notes: "",
    ...categoryInitialValues
  };

  const match = matchPath(useLocation().pathname, {
    path: "/client/:clientId"
  });
  //const { clientId } = useParams<{ clientId: string }>();
  const clientId = match.params["clientId"];
  console.log("Client Id: ", clientId);

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h4" className={classes.title}>
            {clientId == "new" && "New Client Profile"}
            {clientId != "new" && clientId}
          </Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={(
              values: FormValues,
              { setSubmitting }: FormikHelpers<FormValues>
            ) => {
              setSubmitting(true);

              console.log("submitting");
              console.log(values);

              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Grid container direction={"row"} spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"First Name"}
                      name={"firstName"}
                      type={"text"}
                      placeholder={"First Name"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Last Name"}
                      name={"lastName"}
                      type={"text"}
                      placeholder={"Last Name"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Business"}
                      name={"business"}
                      type={"text"}
                      placeholder={"Business"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Address"}
                      name={"address"}
                      type={"text"}
                      placeholder={"Address"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Category"}
                      name={"category"}
                      type={"text"}
                      placeholder={"Category"}
                      fullWidth
                      select
                    >
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">Contact Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Email"}
                      name={"email"}
                      type={"text"}
                      placeholder={"Email"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Phone Number"}
                      name={"phone"}
                      type={"text"}
                      placeholder={"Phone Number"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">Job Information</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Pay Rate"}
                      name={"payRate"}
                      type={"text"}
                      placeholder={"Pay Rate"}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Job Status"}
                      name={"jobStatus"}
                      type={"text"}
                      placeholder={"Job Status"}
                      fullWidth
                      select
                    >
                      <MenuItem value="Not Started">Not Started</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">Additional Information</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      variant={"outlined"}
                      label={"Notes"}
                      name={"notes"}
                      type={"text"}
                      placeholder={"Notes"}
                      fullWidth
                    />
                  </Grid>
                  {/* dynamic form fields occurs here - done by mapping category fields */}
                  {category.map((attb, idx) => (
                    <Grid item key={idx} xs={12}>
                      <Field
                        component={TextField}
                        variant={"outlined"}
                        label={attb}
                        name={attb}
                        type="text"
                        placeholder={attb}
                        fullWidth
                      />
                    </Grid>
                  ))}
                  <Box textAlign="center">
                    <Button
                      type={"submit"}
                      variant={"contained"}
                      color={"primary"}
                      disabled={isSubmitting}
                      className={classes.submitButton}
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </>
  );
};

export default Client;
