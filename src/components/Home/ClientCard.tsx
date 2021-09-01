import { Client } from "../../types";
import {
  Card,
  CardContent,
  CardActions,
  Chip,
  createStyles,
  IconButton,
  makeStyles,
  Typography
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {},

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

const ClientCard = (client: Client) => {
  const classes = useStyles();

  const handleCategoryFilter = () => {
    console.info("You clicked the category button.");
    // To replace with showing all results with clicked category functionality
  };

  const handleStatusFilter = () => {
    console.info("You clicked the job status button.");
    // To replace with showing all results with clicked status functionality
  };

  const handleEditClient = () => {
    console.info("You clicked the edit client button.");
    // To link to client profile page
  };

  return (
    <Card>
      <CardContent className={classes.label}>
        {/*Job Status Label*/}
        <Chip label={client.jobStatus} clickable onClick={handleStatusFilter} />

        {/*Category Label*/}
        <Chip
          label={"Example Client Category"}
          color="primary"
          clickable
          onClick={handleCategoryFilter}
        />
      </CardContent>

      <CardContent className={classes.content}>
        {/*Client Details*/}
        <Typography variant="h4" gutterBottom>
          {client.firstName} {client.lastName}
        </Typography>
        <br />

        <Typography>{client?.business}</Typography>
        <Typography>{client?.address}</Typography>
        <Typography>{client?.email}</Typography>
        <Typography>{client?.phone}</Typography>
        <Typography>{client?.payRate}</Typography>
        <Typography>{client?.notes}</Typography>
      </CardContent>

      <CardActions>
        <IconButton
          className={classes.button}
          aria-label="editClient"
          onClick={handleEditClient}
        >
          <EditIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ClientCard;
