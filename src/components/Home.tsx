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
  Checkbox
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchCard: {
      marginTop: "1rem",
      backgroundColor: theme.palette.primary.light
    },
    clientSearchField: {},
    grid: {
      marginTop: "1rem"
    }
  })
);

const Home = () => {
  const classes = useStyles();

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
      value: "EUR",
      label: "€"
    },
    {
      value: "BTC",
      label: "฿"
    },
    {
      value: "JPY",
      label: "¥"
    }
  ];

  return (
    <>
      <Card variant="outlined" className={classes.searchCard}>
        <CardContent>
          <Grid container direction="row" spacing={1}>
            {/* Search bar and filters */}
            <Grid container direction="column" item xs={12} sm={10}>
              <Grid item>
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

              <Grid item>
                <FormGroup row>
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

            {/* Selection and buttons */}
            <Grid item xs={12} sm={2}>
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
          </Grid>
        </CardContent>
      </Card>

      {clientsData && (
        <Grid container spacing={1} className={classes.grid}>
          {clientsData.map((client, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4}>
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
