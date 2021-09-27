import { User } from "../../types";
import Loading from "../Loading";
import {
  Typography,
  makeStyles,
  createStyles,
  Button,
  IconButton
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import firebase from "firebase/app";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

interface FormValues {
  name: string;
  notes: string;
  [customField: string]: string;
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

  console.log(authUser.uid);

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const [firestoreUser, firestoreLoading] =
    useDocumentData<User>(userReference);

  const newCategoryInitialValues: FormValues = {
    name: "",
    notes: ""
  };

  const existingCategoryInitialValues: FormValues = {
    name: categoryName,
    notes:
      (firestoreUser?.customCategories &&
        firestoreUser?.customCategories[categoryName] &&
        firestoreUser?.customCategories[categoryName].notes) ||
      ""
  };

  if (authLoading || firestoreLoading) {
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
              userReference.collection("customCategories")
              .add(values).then(() => {
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
            }
            
        }}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <Field
              component={TextField}
              variant={"standard"}
              name={"name"}
              type={"text"}
              placeholder={"Category Name"}
              fullWidth
            />
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
            <IconButton>
              <AddIcon />
            </IconButton>
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
