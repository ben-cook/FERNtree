import { Client as ClientType, User } from "../../types";
import { CustomCategory } from "../../types";
import DeleteButtonWithDialog from "../DeleteButtonWithDialog";
import Loading from "../Loading";
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
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";

interface FormValues {
  firstName: string;
  lastName: string;
  business: string;
  address: string;

  category: string; // add category

  email: string;
  phone: string;

  payRate: string;
  //jobStatus: "Not Started" | "In Progress" | "Completed";
  jobStatus: string;

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
  const history = useHistory();
  const { clientId } = useParams<{ clientId: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const isNewClient = clientId == "new";
  const [authUser, authLoading] = useAuthState(firebase.auth());
  const [selectedCategory, setSelectedCategory] = useState(null);


  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const [firestoreUser, firestoreLoading] =
    useDocumentData<User>(userReference);

  //const customCategories = firestoreUser?.customCategories || {};
  
  // Load all category data from the database
  const categoriesReference =  userReference
    .collection("customCategories")

  const [categoriesData, categoriesLoading] = useCollectionData<CustomCategory & { id: string }>(
    categoriesReference,
    {
      idField: "id"
    }
  );

  console.log("Categories Data:", categoriesData);

  // Load category data from the datavase
  // const categoryReference = !isNewCategory ? null : userReference
  //   .collection("customCategories")
  //   .doc(selectedCategory);

  //console.log("Passed");

  // if (isNewCategory){
  //   console.log("isNewCategory true, selectedCategory ", selectedCategory);
  // }

  // const [category, categoryLoading] = isNewCategory ? [null, null] : 
  //   useDocumentData<CustomCategory>(categoryReference);

  // console.log("Passed x2");
  
  // Load specific client data from the database
  const existingClientReference = userReference
    .collection("clients")
    .doc(clientId);

  const [clientData, clientLoading] = useDocumentData<ClientType>(
    existingClientReference
  );


  // Loading
  if (authLoading || firestoreLoading || categoriesLoading || (!isNewClient && clientLoading)) {
    return <Loading />;
  }

  // Set initial category value
  if (selectedCategory == null){
    if (!isNewClient){
      console.log("Set initial category value");
      setSelectedCategory(clientData.category); // set category
    }else{
      setSelectedCategory(""); // new client, empty category
    }
  }

  // Get relevant category fields when user selects a new category
  
  let categoryFields = [];

  const handleCategoryChange = (value) => {

    console.log("Changed category to: ", value);
    setSelectedCategory(value);

  };

  categoriesData.forEach(category => {
       
    if (category.id == selectedCategory){

      if (category.customFields[0] == ""){ // Ignore if no custom fields
        console.log("Fields are empty");
      }else{
        categoryFields = category.customFields;
        console.log("Category Fields changed:" + categoryFields);
      }
    }
     
  });

  console.log("Category Fields:" + categoryFields);

  // Here we generate initialValues object for the custom categories to satisfy the
  // react uncontrolled to controlled input error, using a bit of functional programming magic :D  
  const categoryInitialValues = categoryFields.reduce((acc, cur) => {
    acc[cur] = "";
    return acc;
  }, {});


  const newClientInitialValues: FormValues = {
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
    ...categoryInitialValues
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

              // Editing an EXISTING client
              console.log("Update Category:" + values.category);

              // We're using set() to update an existing document
              userReference
                .collection("clients")
                .doc(clientId)
                .set(values, { merge: true })
                .then(() => {
                  
                  console.log("Testing category changed:", values.category);
                  
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
          {({ isSubmitting, dirty }) => (
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
                  <Field // Dropdown menu
                    component={TextField}
                    variant={"outlined"}
                    label={"Category"}
                    name={"category"}
                    type={"text"}
                    placeholder={"Category"}
                    fullWidth
                    select
                    value={selectedCategory}
                    onChange={(event) => handleCategoryChange(event.target.value)} // When dropdown is changed, update selectedCategory
                  >

                    {/*Allow user to select a category to apply to the client*/}
                    {/*Map the names of each category into a dropdown menu*/}
                    {categoriesData.map((category) => (
                      <MenuItem value={category.id} key={category.id}>
                        {category.id}
                      </MenuItem>
                    ))}

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
                {categoryFields.map((attb, idx) => (
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

                <Grid
                  container
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item>
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
