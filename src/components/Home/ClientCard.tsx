import { ClientConcreteValues, ClientCustomFields } from "../../types";
import Tags from "./Tags";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  createStyles,
  IconButton,
  makeStyles,
  Typography,
  Grid
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { useHistory } from "react-router-dom";

const MAX_CLIENT_NAME_LENGTH = 20;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      height: "100%"
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
    }
  })
);

type Props = {
  id: string;
  concreteValues: ClientConcreteValues;
  tags: string[];
  customFields: ClientCustomFields;
};

const ClientCard = ({
  id,
  concreteValues: {
    firstName,
    lastName,
    business,
    address,
    category,
    email,
    phone,
    payRate,
    jobStatus,
    notes
  },
  tags
}: Props) => {
  const classes = useStyles();
  const history = useHistory();

  // const handleCategoryFilter = () => {
  //   console.info("You clicked the category button.");
  //   // To replace with showing all results with clicked category functionality
  // };

  const handleEditClient = () => {
    history.push(`/client/${id}`);
  };

  let clientName = `${firstName} ${lastName}`;
  if (clientName.length > MAX_CLIENT_NAME_LENGTH) {
    clientName = clientName.slice(0, MAX_CLIENT_NAME_LENGTH - 2) + "...";
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
            {/*Category Label*/}
            <Chip
              label={category}
              color="primary"
              clickable
              onClick={() => history.push(`/category/${category}`)} // Go to edit category page when clicked.
            />
          </CardContent>

          <CardContent className={classes.content}>
            {/*Client Details*/}
            <Typography variant="h4" gutterBottom>
              {clientName}
            </Typography>
            <br />

            <Typography>{business}</Typography>
            <Typography>{address}</Typography>
            <Typography>{email}</Typography>
            <Typography>{phone}</Typography>
            <Typography>{payRate}</Typography>
            <Typography>{jobStatus}</Typography>
            <Typography>{notes}</Typography>
          </CardContent>
        </Grid>

        <Grid item>
          <CardContent>
            {/*ADD TAGS*/}
            <Tags id={id} tags={tags} />
          </CardContent>
          {/*EDIT CLIENT BUTTON*/}
          <CardActions>
            <IconButton
              className={classes.button}
              aria-label="editClient"
              onClick={handleEditClient}
              data-cy={`${firstName}${lastName}`}
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
