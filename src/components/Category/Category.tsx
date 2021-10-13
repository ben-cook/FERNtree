import { CustomCategory } from "../../../functions/src/types";
import { structuredClone, zipWith } from "../../util";
import DeleteButtonWithDialog from "../DeleteButtonWithDialog";
import Loading from "../Loading";
import { CustomItemsSelectorInput } from "./CustomItemsSelector";
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
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";

interface FormValues extends CustomCategory {
  name: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(2)
    },
    submitButton: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginRight: theme.spacing(2)
    }
  })
);

const Category = () => {
  const classes = useStyles();
  const { categoryName } = useParams<{ categoryName: string }>();
  const isNewCategory = categoryName == "new";
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [authUser, authLoading] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const newCategoryInitialValues: FormValues = {
    name: "",
    notes: "",
    customFields: [] // Empty list
  };

  // Load category data from the database
  const categoryReference = userReference
    .collection("customCategories")
    .doc(categoryName);

  const [category, categoryLoading] = isNewCategory
    ? [null, null]
    : useDocumentData<CustomCategory>(categoryReference);

  // console.log("Category ", category, categoryLoading);

  // Loading
  if (authLoading || categoryLoading) {
    return <Loading />;
  }

  // Set initial field values
  const existingCategoryInitialValues: FormValues = {
    name: categoryName,
    notes: (!isNewCategory && !categoryLoading && category?.notes) || "",
    customFields:
      (!isNewCategory && !categoryLoading && category?.customFields) || []
  };

  // console.log(existingCategoryInitialValues);

  return (
    <>
      {/*<pre>{JSON.stringify(firestoreUser, null, 2)}</pre>*/}
      <Grid container>
        <Typography variant="h4" className={classes.title}>
          {isNewCategory && "New Category"}
          {!isNewCategory && categoryName}
        </Typography>
      </Grid>

      <Formik
        initialValues={
          isNewCategory
            ? structuredClone(newCategoryInitialValues)
            : structuredClone(existingCategoryInitialValues)
        }
        validationSchema={Yup.object().shape({
          categoryName: Yup.string(),
          notes: Yup.string()
        })}
        onSubmit={(
          values: FormValues,
          { setSubmitting }: FormikHelpers<FormValues>
        ) => {
          setSubmitting(true);

          if (isNewCategory) {
            userReference
              .collection("customCategories")
              .doc(values.name)
              .set({ notes: values.notes, customFields: values.customFields })
              .then(() => {
                enqueueSnackbar("New category created!", {
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
            categoryReference
              .set({ notes: values.notes, customFields: values.customFields })
              .then(() => {
                enqueueSnackbar("Category Updated!", {
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
            {isNewCategory && (
              <Field
                component={TextField}
                name={"name"}
                type={"text"}
                placeholder={"Category Name"}
                fullWidth
                variant={"outlined"}
                style={{ marginBottom: "1rem" }}
              />
            )}
            <Grid container spacing={2} direction="column">
              <Grid item xs={6} sm={4} md={3}>
                <Typography variant="h5" display="inline">
                  Custom Fields
                </Typography>
              </Grid>

              {isNewCategory && (
                <Grid item xs={12}>
                  <Typography variant="body1" display={"inline"}>
                    Custom fields will be applied to all clients in your new
                    category.
                  </Typography>
                </Grid>
              )}

              {!isNewCategory && (
                <Grid item xs={12}>
                  <Typography variant="body1" display={"inline"}>
                    Custom fields are applied to all clients in the{" "}
                  </Typography>
                  <Typography
                    variant="body1"
                    display={"inline"}
                    color="primary"
                  >
                    {categoryName}
                  </Typography>
                  <Typography variant="body1" display={"inline"}>
                    {" "}
                    category.
                  </Typography>
                </Grid>
              )}

              {/*Dynamic custom fields*/}
              <Grid item xs={12}>
                <CustomItemsSelectorInput name={"customFields"} />
              </Grid>

              {/*Notes Field*/}
              <Grid item xs={12}>
                <Field
                  component={TextField}
                  variant={"outlined"}
                  label={"Additional Notes"}
                  name={"notes"}
                  type={"text"}
                  placeholder={"Notes"}
                  multiline={true}
                  maxRows={5}
                  rows={3}
                  fullWidth
                />
              </Grid>

              <Grid item>
                <Button
                  type={"submit"}
                  variant={"contained"}
                  color={"primary"}
                  disabled={
                    isSubmitting ||
                    (!dirty &&
                      zipWith(
                        (x: string, y: string) => x === y,
                        values.customFields,
                        existingCategoryInitialValues.customFields
                      ).every((x: boolean) => x))
                  }
                  className={classes.submitButton}
                >
                  {isNewCategory && "Save"}
                  {!isNewCategory && "Update"}
                </Button>

                {!isNewCategory && (
                  <DeleteButtonWithDialog
                    buttonText="Delete Category"
                    dialogTitle="Delete Category?"
                    dialogContent="Are you sure you wish to permanently delete this category and all its associated data? This
                    action cannot be reversed."
                    deleteFunction={() => {
                      categoryReference
                        .delete()
                        .then(() => {
                          enqueueSnackbar("Category deleted!", {
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
                )}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Category;
