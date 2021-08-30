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
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory } from "react-router-dom";

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
    newClientContainer: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "&:hover": {
        cursor: "pointer"
      }
    }
  })
);

const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const clientsReference = firebase
    .firestore()
    .collection("users")
    .doc("RrHsrR19CIoCI3vUCWet")
    .collection("clients");

  const [clientsData] = useCollectionData(clientsReference);

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

      {clientsData && (
        <Grid container spacing={1} className={classes.grid}>
          {/* New Client Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              variant="outlined"
              style={{ height: "30vh" }}
              onClick={() => history.push("/client/new")}
            >
              <div className={classes.newClientContainer}>
                <Typography variant="h6" align="center">
                  Add New Client
                </Typography>
              </div>
            </Card>
          </Grid>

          {/* Regular Client Cards */}
          {clientsData.map((client, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
              <Card variant="outlined" style={{ height: "30vh" }}>
                <CardContent>
                  <Typography variant="h6">
                    {client.firstName} {client.lastName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Home;
