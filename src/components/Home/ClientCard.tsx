import { Client } from "../../types";
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

type ExtraProps = {
  id: string;
};

const ClientCard = ({
  id,
  firstName,
  lastName,
  business,
  address,
  email,
  phone,
  payRate,
  notes,
  jobStatus,
  tags
}: Client & ExtraProps) => {
  const classes = useStyles();
  const history = useHistory();

  const handleCategoryFilter = () => {
    console.info("You clicked the category button.");
    // To replace with showing all results with clicked category functionality
  };

  const handleStatusFilter = () => {
    console.info("You clicked the job status button.");
    // To replace with showing all results with clicked status functionality
  };

  const handleEditClient = () => {
    history.push(`/client/${id}`);
  };

  let clientName = `${firstName} ${lastName}`;
  if (clientName.length > MAX_CLIENT_NAME_LENGTH) {
    clientName = clientName.slice(0, MAX_CLIENT_NAME_LENGTH - 2) + "...";
  }

  return (
    <Card style={{ height: "100%" }}>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        style={{ height: "100%" }}
      >
        <Grid item>
          <CardContent className={classes.label}>
            {/*Job Status Label*/}
            <Chip label={jobStatus} clickable onClick={handleStatusFilter} />

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
              {clientName}
            </Typography>
            <br />

            <Typography>{business}</Typography>
            <Typography>{address}</Typography>
            <Typography>{email}</Typography>
            <Typography>{phone}</Typography>
            <Typography>{payRate}</Typography>
            <Typography>{notes}</Typography>
          </CardContent>
        </Grid>

        <Grid item>
          <CardContent>
            <Tags id={id} tags={tags} />
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
        </Grid>
      </Grid>
    </Card>
  );
};

export default ClientCard;
