import { User, Client, CustomCategory } from "../../../types";
import { Typography, createStyles, makeStyles } from "@material-ui/core";
import firebase from "firebase/app";
import {
  useDocumentData,
  useCollectionData
} from "react-firebase-hooks/firestore";

//import Loading from "../../Loading";

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      [theme.breakpoints.down("xs")]: {
        marginTop: theme.spacing(4)
      },
      [theme.breakpoints.up("sm")]: {
        marginTop: theme.spacing(16)
      }
    },
    section: {
      marginBottom: theme.spacing(2)
    }
  })
);

const Dashboard = (user: firebase.User) => {
  const classes = useStyles();

  const userDocumentReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid);

  const [userData, loading] = useDocumentData<User>(userDocumentReference);

  // Getting Clients
  const clientsReference = userDocumentReference.collection("clients");

  //if you want data from client, look in how it is defined in Home.tsx
  const [clientsData, clientsLoading] =
    useCollectionData<Client>(clientsReference);

  // Getting Category Values
  const categoriesReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("customCategories");

  const [categoryData, categoryLoading] =
    useCollectionData<CustomCategory>(categoriesReference);

  // Get today's date
  const date = new Date().toDateString();

  // Loading
  // if (loading || categoryLoading || clientsLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <Typography variant="h5" className={classes.title} paragraph>
        Dashboard
      </Typography>

      <div className={classes.section}>
        <Typography variant="h6" display={"inline"}>
          {`Today is `}
        </Typography>
        <Typography variant="h6" display={"inline"} color="primary">
          {`${date}`}
        </Typography>
        <Typography variant="h6" display={"inline"} paragraph>
          {`.`}
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h6" display={"inline"}>
          {`Currently, you have `}
        </Typography>
        {!loading && !clientsLoading && (
          <Typography variant="h6" display={"inline"} color="primary">
            {`${clientsData?.length}`}
          </Typography>
        )}
        <Typography variant="h6" display={"inline"}>
          {` clients`}
        </Typography>
      </div>

      <div className={classes.section}>
        {/* Checking categories isn't undefined */}
        <Typography variant="h6" display={"inline"}>
          {`under `}
        </Typography>
        {!categoryLoading && (
          <Typography variant="h6" display={"inline"} color="primary">
            {`${categoryData?.length}`}
          </Typography>
        )}
        <Typography variant="h6" display={"inline"}>
          {` categories and `}
        </Typography>
        {!categoryLoading && (
          <Typography variant="h6" display={"inline"} color="primary">
            {/* Checking tags isn't undefined */}
            {`${userData?.userTags ? userData?.userTags.length : 0}`}
          </Typography>
        )}
        <Typography variant="h6" display={"inline"}>
          {` tags.`}
        </Typography>
      </div>

      {/*<pre>{JSON.stringify(user.email, null, 2)}</pre>
      <pre>{JSON.stringify(user.uid, null, 2)}</pre>*/}
    </>
  );
};

export default Dashboard;
