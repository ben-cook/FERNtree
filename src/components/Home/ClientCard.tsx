import {
  CustomCategory,
  ClientConcreteValues,
  ClientCustomFields
} from "../../../functions/src/types";
import ClientAvatar from "../Client/ClientAvatar";
import Tags from "../Tags";
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
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
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

const ClientCard = (props: {
  id: string;
  concreteValues: ClientConcreteValues;
  categoryNames: string[];
  tags: string[];
  customFields: ClientCustomFields;
}) => {
  const classes = useStyles();
  const history = useHistory();

  const [authUser] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  // Load category data from the database
  const categoryReference = userReference
    .collection("customCategories")
    .doc(props.concreteValues.category || "No Category");

  const [category, categoryLoading] =
    useDocumentData<CustomCategory>(categoryReference); // get data for client's category

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

  if (props.concreteValues.email) {
    numFields++;
  }

  if (props.concreteValues.phone) {
    numFields++;
  }

  if (props.concreteValues.address) {
    numFields++;
  }

  // Get custom fields to be displayed
  if (props.customFields && !categoryLoading && category) {
    Object.keys(props.customFields).forEach((key) => {
      // Only add custom fields relating to currently selected category to list
      // Hard limit of 5 fields maximum
      if (category.customFields.includes(key) && numFields < 5) {
        
        if (props.customFields[key]){ // Only include non-empty fields
          fields.push(props.customFields[key]);
          numFields++;
          console.log("Add", props.customFields[key], "to fields", numFields);
        }
      }
    });
  }

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
                {props.categoryNames.includes(
                  props.concreteValues.category
                ) && (
                  // Only categories which exist are displayed
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ height: 35 }}
                    disableRipple
                    disableElevation
                    disableFocusRipple
                    onClick={() =>
                      history.push(`/category/${props.concreteValues.category}`)
                    }
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
                    <ClientAvatar
                      firstName={props.concreteValues.firstName}
                      lastName={props.concreteValues.lastName}
                      email={props.concreteValues.email}
                      size={55}
                    />
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
            {fields &&
              fields.map((field) => (
                <Typography key={field}>{field}</Typography>
              ))}

            {(numFields < 5) && <Typography>{props.concreteValues.notes}</Typography>}

          </CardContent>
        </Grid>

        <Grid item>
          <CardContent>
            {/*ADD TAGS*/}
            <Tags id={props.id} tags={props.tags} />
          </CardContent>
          
          <CardActions style={{ justifyContent: "flex-end" }}>

            {/* Mailto button */}
            <IconButton
              href={`mailto:${props.concreteValues.email}`}
              aria-label="email"
            >
              <MailOutlineIcon />
            </IconButton>

            {/*EDIT CLIENT BUTTON*/}
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
