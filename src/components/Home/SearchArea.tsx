import { CustomCategory, User } from "../../../functions/src/types";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  createStyles,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import ViewListRoundedIcon from "@material-ui/icons/ViewListRounded";
import firebase from "firebase";
import { Dispatch, SetStateAction } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Data } from "react-firebase-hooks/firestore/dist/firestore/types";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) =>
  createStyles({
    searchCard: {
      marginTop: theme.spacing(2),
      backgroundColor: theme.palette.primary.light
    },
    icon: {
      width: 30,
      height: 30,
      color: theme.palette.getContrastText(theme.palette.primary.contrastText)
    },
    categoryButtonGroup: {
      backgroundColor: theme.palette.primary.light
    },
    resetButton: {
      marginRight: theme.spacing(1)
    },
    resetButtonContainer: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        justifyContent: "center"
      },
      [theme.breakpoints.up("sm")]: {
        justifyContent: "flex-end"
      }
    }
  })
);

interface SearchAreaProps {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  selectedTag: string;
  setSelectedTag: Dispatch<SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  isListView: boolean;
  setIsListView: Dispatch<SetStateAction<boolean>>;

  categoryData: Data<
    CustomCategory & {
      name: string;
    },
    "",
    ""
  >[];
}

const SearchArea = (props: SearchAreaProps) => {
  const {
    searchValue,
    setSearchValue,
    selectedTag,
    setSelectedTag,
    selectedCategory,
    setSelectedCategory,
    isListView,
    setIsListView,
    categoryData
  } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down("xs"));

  const [authUser] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const [firestoreUser, firestoreLoading] =
    useDocumentData<User>(userReference);

  // Reset all search filters to default values
  const handleResetSearch = () => {
    setSelectedCategory("All");
    setSelectedTag("All");
    setSearchValue("");
  };

  // Defining tags for dropdown
  let tags: string[] = [];
  if (firestoreUser) {
    if (firestoreUser.userTags) {
      tags = ["All", ...firestoreUser.userTags];
    } else {
      tags = ["All"];
    }
  }

  const labels = !categoryData
    ? []
    : categoryData.map((x: CustomCategory & { name: string }) => {
        return {
          label: x.name,
          value: x.name
        };
      });

  return (
    <Card variant="outlined" className={classes.searchCard}>
      <CardContent>
        <Grid container direction="row" spacing={1} alignItems={"center"}>
          {/* Search bar and filters */}
          <Grid item xs={12} sm={8}>
            <TextField
              variant="outlined"
              label="Find a Contact"
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
          <Grid item xs={12} sm={8}>
            <ButtonGroup
              className={classes.categoryButtonGroup}
              disableElevation
              variant="outlined"
              orientation={mobileView ? "vertical" : "horizontal"}
              fullWidth={mobileView}
            >
              {/*Add Category Button*/}
              <Button onClick={() => history.push("/category/new")}>
                <AddIcon />
              </Button>

              {/*Filtering Category Buttons*/}
              {/*All Categories Button*/}
              <Button
                // Selected button is coloured
                color={selectedCategory === "All" ? "primary" : "default"}
                variant={selectedCategory === "All" ? "contained" : "outlined"}
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
                    label.value === selectedCategory ? "contained" : "outlined"
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

          <Grid item xs={12} sm={4}>
            <div className={classes.resetButtonContainer}>
              <Button
                variant="outlined"
                className={classes.resetButton}
                onClick={() => handleResetSearch()}
              >
                Reset Search
              </Button>

              {/*List / Grid View Button*/}
              <IconButton
                size="medium"
                className={classes.icon}
                onClick={() => setIsListView((isList) => !isList)}
              >
                {isListView ? (
                  <AppsRoundedIcon fontSize="large" />
                ) : (
                  <ViewListRoundedIcon fontSize="large" />
                )}
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SearchArea;
