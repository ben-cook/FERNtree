import { Client, User } from "../../types";
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
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
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
    },
    categoryButtonGroup: {
      backgroundColor: "white"
    }
  })
);

const Home = () => {
  const classes = useStyles();

  const [authUser] = useAuthState(firebase.auth());

  const PersonAddButton = () => (
    <IconButton color="primary" size="medium" className={classes.icon}>
      <PersonAddIcon fontSize="large" />
    </IconButton>
  );

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const [firestoreUser, firestoreLoading] =
    useDocumentData<User>(userReference);

  const clientsReference = userReference.collection("clients");

  const [clientsData] = useCollectionData<Client & { id: string }>(
    clientsReference,
    {
      idField: "id"
    }
  );

  // declaring a state variable called selectedTag
  // setSelectedTag updates selectedTag when called
  // useState is initialising the state to the string "All"
  const [selectedTag, setSelectedTag] = useState<string>("All"); 

  // CHANGE: initalise searchValue
  const [searchValue, setSearchValue] = useState<string>("");

  // Categories in search bar
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

  // Defining tags for dropdown 
  let tags: string[] = [];
  if (firestoreUser) {
    if (firestoreUser.userTags) {
      tags = ["All", ...firestoreUser.userTags];
    } else {
      tags = ["All"];
    }
  }

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
                // CHANGE: Set value to searchValue
                value = {searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                InputProps={{
                  style: { backgroundColor: "white" },
                  endAdornment: (
                    <InputAdornment component="div" position="end">
                      <IconButton >
                        <SearchIcon/> 
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* Selection and buttons */}
            <Grid item xs={12} sm={4}>
              {!firestoreLoading && (
                <TextField // Dropdown menu
                  variant="outlined"
                  className={classes.clientSearchField}
                  fullWidth
                  margin="normal"
                  size="medium"
                  InputProps={{
                    style: { backgroundColor: "white" }
                  }}
                  select
                  value={selectedTag}
                  onChange={(event) => setSelectedTag(event.target.value)} // When dropdown is changed, update selectedTag
                >
                  {/* tags = dropdownTags, tag = each tag inside tags */}
                  {tags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Grid>

            <Grid item xs={10}>
              <ButtonGroup className={classes.categoryButtonGroup}>
                <Button onClick={() => console.log("add new category")}>
                  <AddIcon />
                </Button>
                {labels.map((label) => (
                  <Button key={label.value}>{label.value}</Button>
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
            // Filtering which clients to show based on tags
            .filter((client) => {
              //CHANGE
              if (client.firstName.includes(searchValue) || client.lastName.includes(searchValue)) {
                if (selectedTag === "All") { // If the selected tag is "All", display this client
                  return true;
                }

                if (!client.tags) { // If the client has no tags, don't display
                  return false;
                }

                return client.tags.includes(selectedTag); // If client has tag, display client
              }
            })
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
