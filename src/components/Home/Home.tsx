import { Client, User, CustomCategory } from "../../types";
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
  Button,
  useTheme
} from "@material-ui/core";
// Import icons
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SearchIcon from "@material-ui/icons/Search";
// Import firebase and react
import firebase from "firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchCard: {
      marginTop: "1rem",
      backgroundColor: theme.palette.primary.main
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
      backgroundColor: theme.palette.primary.main
    },
    resetButton: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },
    resetButtonContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "center"
      },
      [theme.breakpoints.up("sm")]: {
        justifyContent: "flex-end"
      }
    }
  })
);

const Home = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

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

  // Getting client values
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

  // declaring a state variable called selectedCategory
  // setSelectedCategory updates selectedCategory when called
  // useState is initialising the state to the string "All"
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // declaring a state variable called searchValue
  // to be used in search bar to filter results
  const [searchValue, setSearchValue] = useState<string>("");

  // Getting Category Values
  const categoriesReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid)
    .collection("customCategories");

  const [categoryData] = useCollectionData<CustomCategory & { name: string }>(
    categoriesReference,
    {
      idField: "name"
    }
  );

  console.log(categoryData);

  const labels = !categoryData
    ? []
    : categoryData.map((x: CustomCategory & { name: string }) => {
        return {
          label: x.name,
          value: x.name
        };
      });

  // List of category names to be passed into client cards for category verification
  let categoryNames: string[] = [];
  categoryNames = !categoryData
    ? [] // return empty array if no category data
    : categoryData.map((value) => {
        return value.name;
      });

  console.log("Category Names:", categoryNames);

  // Defining tags for dropdown
  let tags: string[] = [];
  if (firestoreUser) {
    if (firestoreUser.userTags) {
      tags = ["All", ...firestoreUser.userTags];
    } else {
      tags = ["All"];
    }
  }

  // Reset all search filters to default values
  const handleResetSearch = () => {
    console.info("You clicked the reset search button.");
    setSelectedCategory("All");
    setSelectedTag("All");
    setSearchValue("");
  };

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
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                InputProps={{
                  style: {
                    backgroundColor: theme.palette.background.default
                  },
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
              {!firestoreLoading && (
                // Tags dropdown menu to filter tags
                <TextField // Dropdown menu
                  variant="outlined"
                  className={classes.clientSearchField}
                  fullWidth
                  margin="normal"
                  size="medium"
                  InputProps={{
                    style: { backgroundColor: theme.palette.background.default }
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

            {/*Category Filtering Buttons*/}
            <Grid item xs={12} sm={10}>
              <ButtonGroup className={classes.categoryButtonGroup}>
                {/*Add Category Button*/}
                <Button onClick={() => history.push("/category/new")}>
                  <AddIcon />
                </Button>

                {/*Filtering Category Buttons*/}
                {/*All Categories Button*/}
                <Button
                  // Selected button is coloured
                  color={selectedCategory === "All" ? "primary" : "default"}
                  variant={
                    selectedCategory === "All" ? "contained" : "outlined"
                  }
                  // Show clients in all categories
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </Button>
                {/*Category Buttons*/}
                {labels.map((label) => (
                  <Button
                    key={label.value}
                    // Selected button is coloured
                    color={
                      label.value === selectedCategory ? "primary" : "default"
                    }
                    variant={
                      label.value === selectedCategory
                        ? "contained"
                        : "outlined"
                    }
                    // Filter the home page by category
                    onClick={() => setSelectedCategory(label.value)}
                  >
                    {label.value}

                    {/*Edit category icon appears when category is selected*/}
                    {selectedCategory == label.value && (
                      <Button
                        size="small"
                        // Redirect to Category Settings page of selected category
                        onClick={() => history.push(`/category/${label.value}`)}
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                    )}
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>

            <Grid item xs={12} sm={2}>
              <div className={classes.resetButtonContainer}>
                <Button variant="outlined" onClick={() => handleResetSearch()}>
                  Reset Search
                </Button>
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
            <Card style={{ height: "100%", minHeight: 400 }}>
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
            // Filtering which clients to show based on search, category filter and tags
            .filter((client) => {
              // for every value (of each field), if the value is not ID AND includes search
              // remove client id from string
              // eslint-disable-next-line
              const { tags, ...rest } = client;

              const reduction: string = Object.values(rest).reduce(
                (a, b) => `${JSON.stringify(a)} ${JSON.stringify(b)}`,
                ""
              );

              if (
                reduction
                  .replace(client.id, "")
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
              ) {
                // NOW CHECK TAGS and CATEGORY
                if (selectedTag === "All" && selectedCategory === "All") {
                  // If the selected tag AND category is "All", display this client
                  return true;
                }

                if (!client.tags && !client.category) {
                  // If the client has no tags or no category, don't display
                  return false;
                }

                // If client has tag or selected category, display client
                // Fancy logic here:
                // If client has the selected category and tags is set to All, return that client
                // If client has the selected tag and category is set to All, return that client
                // If client has selected tag AND selected category, return that client
                return (
                  (selectedCategory === "All"
                    ? true
                    : client.category == selectedCategory) &&
                  (selectedTag === "All"
                    ? true
                    : client.tags?.includes(selectedTag))
                );
              }
            })
            .sort((a, b) => {
              return a.firstname && b.firstName
                ? a.firstName.localeCompare(b.firstName)
                : 1;
            })
            .reverse()
            .map((client, idx) => {
              const {
                id,
                firstName,
                lastName,
                business,
                address,
                category,
                email,
                phone,
                payRate,
                jobStatus,
                notes,
                tags,
                ...rest
              } = client;

              return (
                <Grid item key={idx} xs={12} sm={6} md={4}>
                  <ClientCard
                    id={id}
                    concreteValues={{
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
                    }}
                    categoryNames={categoryNames}
                    tags={tags}
                    customFields={rest}
                  />
                </Grid>
              );
            })}
      </Grid>
    </>
  );
};

export default Home;
