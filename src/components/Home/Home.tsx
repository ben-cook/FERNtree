import { Client } from "../../types";
import ClientCard from "./ClientCard";
import {
  Card,
  CardContent,
  createStyles,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchCard: {
      marginTop: "1rem",
      backgroundColor: theme.palette.primary.light
    },

    clientSearchField: {},
    grid: {
      marginTop: "1rem"
    },

    cardContent: {
      margin: "auto",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column"
    },

    icon: {
      width: 60,
      height: 60
    }
  })
);

const Home = () => {
  const classes = useStyles();

  const [user, loading] = useAuthState(firebase.auth());

  const PersonAddButton = () => (
    <IconButton color="primary" size="medium" className={classes.icon}>
      <PersonAddIcon fontSize="large" />
    </IconButton>
  );

  {
    /* Pull client data for user */
  }
  const clientsReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("clients");

  const [clientsData] = useCollectionData<Client>(clientsReference);

  const labels = [
    {
      value: "All",
      label: "All"
    },
    {
      value: "Technology",
      label: "Technology"
    },
    {
      value: "Journalism",
      label: "Journalism"
    },
    {
      value: "Mentor",
      label: "Mentor"
    }
  ];

  return (
    <>
      <Card variant="outlined" className={classes.searchCard}>
        <CardContent>
          <Grid container direction="row" spacing={1} alignItems={"center"}>
            {/* Search bar and filters */}
            <Grid item xs={12} sm={8}>
              <TextField
                variant="outlined"
                label="Find your Client"
                className={classes.clientSearchField}
                fullWidth
                margin="normal"
                size="medium"
                InputProps={{
                  style: { backgroundColor: "white" },
                  endAdornment: (
                    <InputAdornment component="div" position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Selection and buttons */}
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                className={classes.clientSearchField}
                fullWidth
                margin="normal"
                size="medium"
                InputProps={{
                  style: { backgroundColor: "white" }
                }}
                select
              >
                {labels.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormGroup row>
                <Typography>Categories - remove this stuff</Typography>
                {labels.map((label) => (
                  <FormControlLabel
                    key={label.value}
                    control={<Checkbox color="primary" />}
                    label={label.label}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Show all clients as cards */}
      {user && !loading && clientsData && (
        <Grid container spacing={3} className={classes.grid}>
          {/* {clientsData.map((client, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <Card variant="outlined" style={{ height: "30vh" }}>
                <CardContent>
                  {client.firstName} {client.lastName}
                </CardContent>
              </Card>
            </Grid>
          ))} */}

          {/*Add new client card*/}
          <Grid item key={0} xs={12} sm={6} md={4}>
            <Link to="/client/new">
              <Card style={{ height: "100%" }}>
                <Grid
                  container
                  direction="column"
                  justifyContent="center"
                  alignContent="stretch"
                  alignItems="center"
                  style={{ height: "100%" }}
                >
                  <Grid item>
                    <PersonAddButton />
                  </Grid>
                </Grid>
              </Card>
            </Link>
          </Grid>

          {clientsData
            /*Order client cards alphabetically*/
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
            .reverse()
            /*Map to individual cards*/
            .map((client, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <ClientCard {...client} />
              </Grid>
            ))}
        </Grid>
      )}
    </>
  );
};

export default Home;
