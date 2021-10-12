import {
  Client as ClientType,
  ClientConcreteValues,
  ClientCustomFields,
  CustomCategory
} from "../../../functions/src/types";
import DeleteButtonWithDialog from "../DeleteButtonWithDialog";
import Tags from "../Home/Tags";
import Loading from "../Loading";
import { CategorySelectorInput } from "./CategorySelector";
import ClientAvatar from "./ClientAvatar";
import {
  Typography,
  makeStyles,
  createStyles,
  Button,
  Grid
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
    newClientTitle: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(2)
    },

    submitButton: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      color: "#ffffff"
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

  // getting the client's tags
  let tags: string[] = [];

  if (clientData && clientData.tags) {
    tags = clientData.tags;
  }

  // Loading
  if (authLoading || categoriesLoading || clientLoading) {
    return <Loading />;
  }

  // Get all category names
  const categories = categoriesData.map((category) => category.id);

  // Get relevant category fields when user selects a new category

  // Function which returns category fields of a given category Id
  function getCategoryFields(categoryId: string): string[] {
    let categoryFields = [];

    categoriesData.forEach((category) => {
      if (!category.customFields || category.customFields[0] === "") {
        // Ignore if no custom fields
        console.log("Fields are empty");
      } else if (category.id == categoryId) {
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
    address: "",
    category: "", // no category selected yet
    email: "",
    phone: "",
    notes: "",
    ...newClientCategoryInitialValues
  };

  const existingClientInitialValues: FormValues = {
    firstName: clientData?.firstName,
    lastName: clientData?.lastName,
    address: clientData?.address,
    category: clientData?.category, // Set initial category
    email: clientData?.email,
    phone: clientData?.phone,
    notes: clientData?.notes,
    ...existingClientCategoryInitialValues
  };

  return (
    <Grid container justifyContent="center">
      {/* HEADER: NAME + AVATAR */}
      {isNewClient && (
        <Grid container direction={"row"} spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="h4" className={classes.newClientTitle}>
              New Client Profile
            </Typography>
          </Grid>
        </Grid>
      )}

      {!isNewClient && (
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "1rem" }}
        >
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="h4" align="center">
              {`${clientData?.firstName} ${clientData?.lastName}`}
            </Typography>
          </Grid>

          <Grid
            container
            item
            xs={6}
            sm={4}
            md={3}
            justifyContent="center"
            alignItems="center"
            alignContent="center"
          >
            <Grid item>
              <ClientAvatar client={clientData} size={200} />
            </Grid>
          </Grid>
        </Grid>
      )}

      {/*Tags section*/}
      <Grid
        container
        //direction={'column'}
        spacing={10}
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid item>{clientData && <Tags id={clientId} tags={tags} />}</Grid>
      </Grid>

      {/* FORM */}
      <Grid item xs={12} sm={8} md={6}>
        <Formik
          initialValues={
            isNewClient ? newClientInitialValues : existingClientInitialValues
          }
          enableReinitialize
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
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
            <Form style={{ marginTop: "2rem" }}>
              <Grid container direction={"row"} spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Contact Information</Typography>
                </Grid>
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
                <Grid item xs={12}>
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
                  <Typography variant="h5">Category Details</Typography>
                </Grid>

                <Grid item xs={12}>
                  <CategorySelectorInput
                    name={"category"}
                    categories={categories}
                  />
                </Grid>

                {/* dynamic form fields occurs here - done by mapping category fields */}
                {getCategoryFields(values.category).map((attb) => (
                  <Grid item key={attb} xs={12}>
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
                        dialogContent="Are you sure you wish to permanently delete this client? 
                                      This action cannot be reversed."
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
