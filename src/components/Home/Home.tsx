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
  ButtonGroup,
  Button
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useHistory } from "react-router-dom";

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
    },
    categoryButtonGroup: {
      backgroundColor: "white"
    }
  })
);

const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const [user] = useAuthState(firebase.auth());

  const PersonAddButton = () => (
    <IconButton color="primary" size="medium" className={classes.icon}>
      <PersonAddIcon fontSize="large" />
    </IconButton>
  );

  const clientsReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("clients");

  const [clientsData] = useCollectionData<Client & { id: string }>(
    clientsReference,
    {
      idField: "id"
    }
  );

  const categoriesReference = firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .collection("customCategories");

  const [categoryData] = useCollectionData(categoriesReference);
  console.log(categoryData);

  const labels = !categoryData ? [] : categoryData.map((x:any) => {
    return {
      label: x.name,
      value: x.name
    }
  });

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

            <Grid item xs={10}>
              <ButtonGroup className={classes.categoryButtonGroup}>
                <Button onClick={() => history.push("/category/new")}>
                  <AddIcon />
                </Button>
                <Button>All</Button>
                {labels.map((label) => (
                  <Button key={label.value} onClick={() => history.push(`/category/${label.value}`)}>
                    {label.value}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>

            <Grid item xs={2}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton>
                  <SettingsIcon style={{ color: "black", fontSize: 28 }} />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Show all clients as cards */}
      <Grid container spacing={3} className={classes.grid}>
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

        {clientsData &&
          clientsData
            .sort((a, b) => a.firstName.localeCompare(b.firstName))
            .reverse()
            .map((client, idx) => (
              <Grid item key={idx} xs={12} sm={6} md={4}>
                <ClientCard {...client} />
              </Grid>
            ))}
      </Grid>
    </>
  );
};

export default Home;
