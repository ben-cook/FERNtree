import { Client, CustomCategory, User } from "../../../functions/src/types";
import GridView from "./GridView";
import ListView from "./ListView";
import SearchArea from "./SearchArea";
import { createStyles, makeStyles } from "@material-ui/core";
import firebase from "firebase";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData
} from "react-firebase-hooks/firestore";

const useStyles = makeStyles((theme) =>
  createStyles({
    mainContent: {
      marginTop: theme.spacing(2)
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
      width: 30,
      height: 30,
      color: theme.palette.getContrastText(theme.palette.primary.contrastText)
    }
  })
);

const Home = () => {
  const classes = useStyles();

  const [authUser] = useAuthState(firebase.auth());

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

  // Getting Category Values
  const categoriesReference = userReference.collection("customCategories");
  const [categoryData] = useCollectionData<CustomCategory & { name: string }>(
    categoriesReference,
    {
      idField: "name"
    }
  );

  // selectedTag is used the search bar to filter results
  const [selectedTag, setSelectedTag] = useState<string>("All");
  // selectedCategory is used the search bar to filter results
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  // searchValue is used the search bar to filter results
  const [searchValue, setSearchValue] = useState<string>("");
  // Trigger switch between list and grid view
  const [isListView, setIsListView] = useState<boolean>(false);

  const filteredSortedClientData = !clientsData
    ? []
    : clientsData
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
          return a.firstName && b.firstName
            ? a.firstName.localeCompare(b.firstName)
            : 1;
        })
        .reverse();

  return (
    <>
      <SearchArea
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        firestoreUser={firestoreUser}
        firestoreLoading={firestoreLoading}
        isListView={isListView}
        setIsListView={setIsListView}
        categoryData={categoryData}
      />

      <div className={classes.mainContent}>
        {isListView ? (
          <ListView clientData={filteredSortedClientData} />
        ) : (
          <GridView
            clientData={filteredSortedClientData}
            categoryData={categoryData}
          />
        )}
      </div>
    </>
  );
};

export default Home;
