import {
  Client as ClientType,
  ClientConcreteValues,
  ClientCustomFields
} from "../../types";
import { CustomCategory } from "../../types";
import DeleteButtonWithDialog from "../DeleteButtonWithDialog";
import Loading from "../Loading";
import { CategorySelectorInput } from "./CategorySelector";
import {
  Typography,
  makeStyles,
  createStyles,
  Button,
  Grid,
  MenuItem
} from "@material-ui/core";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useSnackbar } from "notistack";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";

type FormValues = ClientConcreteValues & ClientCustomFields;

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
  const history = useHistory();
  const { clientId } = useParams<{ clientId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const isNewClient = clientId == "new";
  const [authUser, authLoading] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  // Load all category data from the database
  const categoriesReference = userReference.collection("customCategories");

  const [categoriesData, categoriesLoading] = useCollectionData<
    CustomCategory & { id: string }
  >(categoriesReference, {
    idField: "id"
  });

  // Load specific client data from the database
  const existingClientReference = userReference
    .collection("clients")
    .doc(clientId);

  const [clientData, clientLoading] = useDocumentData<ClientType>(
    existingClientReference
  );

  // Loading
  if (authLoading || categoriesLoading || clientLoading) {
    return <Loading />;
  }

  // Get all category names
  const categories = categoriesData.map((category) => category.id);

  // Get relevant category fields when user selects a new category

  // Function which returns category fields of a given category Id
  function getCategoryFields(categoryId){
    let categoryFields = [];

    categoriesData.forEach((category) => {

      if (!category.customFields || category.customFields[0] === "") {
        // Ignore if no custom fields
        console.log("Fields are empty");

      } else if (category.id == categoryId){
        categoryFields = category.customFields;

        console.log("Category changed:" + categoryId);
        console.log("Category Fields changed:" + categoryFields);
      }

    });

    return categoryFields;
  }

  // Here we generate initialValues object for the custom categories to satisfy the
  // react uncontrolled to controlled input error, using a bit of functional programming magic :D

  const categoryFields = getCategoryFields(clientData?.category); // initialise existing client

  // Initialise category values for an existing client
  const existingClientCategoryInitialValues = categoryFields
    ? categoryFields.reduce((acc, cur) => {
        if (clientData && clientData[cur]) {

          // Existing data for category
          //console.log("clientData[cur] defined:", clientData[cur]);
          acc[cur] = clientData[cur];

        } else {

          // New category, no client data (undefined) yet so initialise to empty
          //console.log("clientData[cur] undefined:", clientData[cur]);
          acc[cur] = "";

        }
        return acc;
      }, {})

    : // empty if no category fields
      categoryFields.reduce((acc, cur) => {
        acc[cur] = "";
        return acc;
      }, {});


  //Initialise category values to empty for a new client
  const newClientCategoryInitialValues = [].reduce((acc, cur) => {
    acc[cur] = "";
    return acc;
  }, {});

  console.log(
    "existingcategoryinitialvalues: " +
      JSON.stringify(existingClientCategoryInitialValues)
  );

  console.log(
    "newclientcategoryinitialvalues: " +
      JSON.stringify(newClientCategoryInitialValues)
  );

  const newClientInitialValues: FormValues = {
    firstName: "",
    lastName: "",
    business: "",
    address: "",
    category: "", // no category selected yet
    email: "",
    phone: "",
    payRate: "",
    jobStatus: "Not Started",
    notes: "",
    ...newClientCategoryInitialValues
  };

  const existingClientInitialValues: FormValues = {
    firstName: clientData?.firstName,
    lastName: clientData?.lastName,
    business: clientData?.business,
    address: clientData?.address,
    category: clientData?.category, // Set initial category
    email: clientData?.email,
    phone: clientData?.phone,
    payRate: clientData?.payRate,
    jobStatus: clientData?.jobStatus || "Not Started",
    notes: clientData?.notes,
    ...existingClientCategoryInitialValues
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h4" className={classes.title}>
          {isNewClient && "New Client Profile"}
          {!isNewClient && `${clientData?.firstName} ${clientData?.lastName}`}
        </Typography>
        <Formik
          initialValues={
            isNewClient ? newClientInitialValues : existingClientInitialValues
          }
          enableReinitialize
          validationSchema={Yup.object().shape({
            firstName: Yup.string(),
            lastName: Yup.string(),
            business: Yup.string(),
            address: Yup.string(),
            category: Yup.string(), //adding category in
            email: Yup.string().email(),
            phone: Yup.string(),
            payRate: Yup.string(),
            jobStatus: Yup.string(),
            notes: Yup.string()
          })}
          
          onSubmit={(
            values: FormValues,
            { setSubmitting }: FormikHelpers<FormValues>
          ) => {
            setSubmitting(true);

            // Adding a NEW client

            if (isNewClient) {
              // We're using add() instead of set() because we want an auto-generated UUID
              userReference
                .collection("clients")
                .add(values)
                .then(() => {
                  console.log("Testing new category fields : ", values);
                  enqueueSnackbar("New client created!", {
                    variant: "success"
                  });
                  history.push("/");
                })
                .catch((err) => {
                  console.error(err);
                  enqueueSnackbar("Something went wrong.", {
                    variant: "error"
                  });
                })
                .finally(() => setSubmitting(false));
            } else {
              // We're using set() to update an existing document / client
              userReference
                .collection("clients")
                .doc(clientId)
                .set(values, { merge: true })
                .then(() => {
                  console.log("Testing category changed:", values.category);
                  console.log("Testing category fields changed: ", values);

                  enqueueSnackbar("Updated client details.", {
                    variant: "success"
                  });
                })
                .catch((err) => {
                  console.error(err);
                  enqueueSnackbar("Something went wrong.", {
                    variant: "error"
                  });
                })
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {({ isSubmitting, dirty, values }) => (
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
                  <CategorySelectorInput
                    name={"category"}
                    categories={categories}
                  />
                </Grid>

                {/* dynamic form fields occurs here - done by mapping category fields */}
                {getCategoryFields(values.category).map((attb, idx) => (
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

                <Grid
                  container
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item>
                    {/*Save/Update Button*/}
                    <Button
                      type={"submit"}
                      variant={"contained"}
                      color={"primary"}
                      disabled={isSubmitting || !dirty}
                      className={classes.submitButton}
                      data-cy="submit"
                    >
                      {isNewClient && "Save"}
                      {!isNewClient && "Update"}
                    </Button>
                  </Grid>
                  {/*Delete Button*/}
                  {!isNewClient && (
                    <Grid item>
                      <DeleteButtonWithDialog
                        buttonText="Delete Client"
                        dialogTitle="Delete Client?"
                        dialogContent="Are you sure you wish to permanently delete this client? This
            action cannot be reversed."
                        deleteFunction={() => {
                          existingClientReference
                            .delete()
                            .then(() => {
                              enqueueSnackbar("Client deleted!", {
                                variant: "success"
                              });
                              history.push("/");
                            })
                            .catch((err) => {
                              console.error(err);
                              enqueueSnackbar("Something went wrong.", {
                                variant: "error"
                              });
                            });
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default Client;
