import { CustomCategory } from "../../types";
import Loading from "../Loading";
import { CustomItemsSelectorInput } from "./CustomItemsSelector";
import {
  Typography,
  makeStyles,
  createStyles,
  Button
} from "@material-ui/core";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useSnackbar } from "notistack";
import { useState } from "react";
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
      marginBottom: theme.spacing(3)
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
    customFields: [""]
  };

  // Load category data from the database
  const categoryReference = userReference
    .collection("customCategories")
    .doc(categoryName);

  const [category, categoryLoading] = isNewCategory
    ? [null, null]
    : useDocumentData<CustomCategory>(categoryReference);

  console.log("Category ", category, categoryLoading);

  const existingCategoryInitialValues: FormValues = {
    name: categoryName,
    notes: (!isNewCategory && !categoryLoading && category.notes) || "",
    customFields:
      (!isNewCategory && !categoryLoading && category.customFields) || []
  };

  const [customFields, setCustomFields] = useState(
    existingCategoryInitialValues.customFields
  );

  console.log(existingCategoryInitialValues);

  if (authLoading || categoryLoading) {
    return <Loading />;
  }

  return (
    <>
      {/*<pre>{JSON.stringify(firestoreUser, null, 2)}</pre>*/}
      <Typography variant="h4" className={classes.title}>
        {isNewCategory && "New Category"}
        {!isNewCategory && categoryName}
      </Typography>
      <Formik
        initialValues={
          isNewCategory
            ? newCategoryInitialValues
            : existingCategoryInitialValues
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
        {({ isSubmitting, dirty }) => (
          <Form>
            {isNewCategory && (
              <Field
                component={TextField}
                variant={"standard"}
                name={"name"}
                type={"text"}
                placeholder={"Category Name"}
                fullWidth
              />
            )}
            <Field
              component={TextField}
              variant={"outlined"}
              label={"Notes"}
              name={"notes"}
              type={"text"}
              placeholder={"Notes"}
              multiline={true}
              maxRows={5}
              rows={3}
              fullWidth
            />
            <Typography variant="h5" display="inline">
              Custom Fields
            </Typography>

            {/* I guess this is where custom field adding will go @ivy */}
            <CustomItemsSelectorInput
              name={"customFields"}

            />
            <br />
            {isNewCategory && (
              <Typography variant="body1" display={"inline"}>
                Custom fields will be applied to all clients in your new
                category.
              </Typography>
            )}
            {!isNewCategory && (
              <>
                <Typography variant="body1" display={"inline"}>
                  Custom fields are applied to all clients in the{" "}
                </Typography>
                <Typography variant="body1" display={"inline"} color="primary">
                  {categoryName}
                </Typography>
                <Typography variant="body1" display={"inline"}>
                  {" "}
                  category.
                </Typography>
              </>
            )}
            <br />

            <Button
              type={"submit"}
              variant={"contained"}
              color={"primary"}
              disabled={isSubmitting || !dirty}
              className={classes.submitButton}
            >
              {isNewCategory && "Save"}
              {!isNewCategory && "Update"}
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Category;
