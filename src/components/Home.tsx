import {
  Card,
  Grid,
  makeStyles,
  createStyles,
  CardContent
} from "@material-ui/core";
import firebase from "firebase";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";

const useStyles = makeStyles({
  grid: {
    marginTop: "1rem"
  }
});

const Home = () => {
  const classes = useStyles();

  const userDataReference = firebase
    .firestore()
    .collection("users")
    .doc("RrHsrR19CIoCI3vUCWet");

  const [userData] = useDocumentData(userDataReference);

  const clientsReference = firebase
    .firestore()
    .collection("users")
    .doc("RrHsrR19CIoCI3vUCWet")
    .collection("clients");

  const [clientsData] = useCollectionData(clientsReference);

  return (
    <>
      {clientsData && (
        <Grid direction="column" container spacing={1} className={classes.grid}>
          {clientsData.map((client, idx) => (
            <Grid item key={idx}>
              <Card variant="outlined">
                <CardContent>
                  {client.firstName} {client.lastName}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <pre>{JSON.stringify(clientsData, null, 2)}</pre>
    </>
  );
};

export default Home;
