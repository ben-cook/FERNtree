import { CustomCategory, ClientConcreteValues, ClientCustomFields } from "../../types";
import ClientAvatar from "../Client/ClientAvatar";
import Tags from "./Tags";
import {
  Card,
  CardContent,
  CardActions,
  createStyles,
  IconButton,
  makeStyles,
  Typography,
  Grid,
  Button
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router-dom";

const MAX_CLIENT_NAME_LENGTH = 20;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%",
      minHeight: 400
    },

    content: {
      marginLeft: 30,
      marginRight: "auto",
      justifyContent: "center",
      alignContent: "center"
    },

    label: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(0.5)
      }
    },

    button: {
      marginLeft: "auto",
      marginRight: 5
    },

    avatar: {
      marginRight: 15,
      marginLeft: "auto"
    }
  })
);

// type Props = {
//   id: string;
//   concreteValues: ClientConcreteValues;
//   tags: string[];
//   categoryNames: string[];
//   customFields: ClientCustomFields;
// };

const ClientCard = (props : { id : string, concreteValues : ClientConcreteValues, categoryNames : string[] , tags : string[] , customFields : ClientCustomFields}) => {
  const classes = useStyles();
  const history = useHistory();

  const [authUser, authLoading] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  // Load category data from the database
  const categoryReference = userReference
    .collection("customCategories")
    .doc(props.concreteValues.category);

  const [category, categoryLoading] = useDocumentData<CustomCategory>(categoryReference); // get data for client's category
  
  

  // const {
  //   firstName,
  //   lastName,
  //   address,
  //   category,
  //   email,
  //   phone,
  //   notes
  // } = concreteValues;

  console.log("Custom Fields", props.customFields);

  // If edit button is clicked
  const handleEditClient = () => {
    history.push(`/client/${props.id}`);
  };

  // Format client's name
  let clientName = `${props.concreteValues.firstName} ${props.concreteValues.lastName}`;
  if (clientName.length > MAX_CLIENT_NAME_LENGTH) {
    clientName = clientName.slice(0, MAX_CLIENT_NAME_LENGTH - 2) + "...";
  }

  const fields = [];
  let numFields = 0;
  
  if (props.concreteValues.email){
    numFields++;
  }

  if (props.concreteValues.phone){
    numFields++;
  }

  if (props.concreteValues.address){
    numFields++;
  }

  if (props.concreteValues.notes){
    numFields++;
  }

  // Get custom fields to be displayed
  if (props.customFields && !categoryLoading){

    Object.keys(props.customFields).forEach(key => {
      console.log(key , props.customFields[key]); // key , value
      
      // Only add custom fields relating to currently selected category to list
      // Hard limit of 5 fields maximum
      if (category.customFields.includes(key) && numFields < 5){
        fields.push(props.customFields[key]);
        numFields++;
        //console.log("Add", props.customFields[key], "to fields", numFields);
      }
    })  

  }

  console.log("Fields:", fields);

  return (
    <Card className={classes.root}>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        style={{ height: "100%" }}
      >
        <Grid item>
          <CardContent className={classes.label}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                {props.categoryNames.includes(props.concreteValues.category) && (
                  // Only categories which exist are displayed
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ height: 35 }}
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    onClick={() => history.push(`/category/${props.concreteValues.category}`)}
                  >
                    <Typography style={{ color: "#fff" }} variant="button">
                      {props.concreteValues.category}
                    </Typography>
                  </Button>
                )}
              </Grid>
              <Grid item>
                {props.concreteValues && props.concreteValues.firstName && (
                  <div className={classes.avatar}>
                    <ClientAvatar client={props.concreteValues} size={55} />
                  </div>
                )}
              </Grid>
            </Grid>
          </CardContent>

          <CardContent className={classes.content}>
            {/*Client Details*/}
            <Typography variant="h4" gutterBottom>
              {clientName}
            </Typography>

            <br />
            
            <Typography>{props.concreteValues.email}</Typography>
            <Typography>{props.concreteValues.phone}</Typography>
            <Typography>{props.concreteValues.address}</Typography>
            
            {/* Display custom field contents */}
            {fields && fields.map((field) => (
              <Typography key={field}>
                {field}
              </Typography>
            ))
            }

            <Typography>{props.concreteValues.notes}</Typography>

          </CardContent>
        </Grid>

        <Grid item>
          <CardContent>
            {/*ADD TAGS*/}
            <Tags id={props.id} tags={props.tags} />
          </CardContent>
          {/*EDIT CLIENT BUTTON*/}
          <CardActions>
            <IconButton
              className={classes.button}
              aria-label="editClient"
              onClick={handleEditClient}
              data-cy={`${props.concreteValues.firstName}${props.concreteValues.lastName}`}
            >
              <EditIcon />
            </IconButton>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ClientCard;
