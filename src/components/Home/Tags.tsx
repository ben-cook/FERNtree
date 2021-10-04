import { User } from "../../types";
import {
  Chip,
  createStyles,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Theme
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import firebase from "firebase/app";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0
    },
    chip: {
      margin: theme.spacing(0.5)
    }
  })
);

const Tags = ({ id: clientID, tags }: { id: string; tags: string[] }) => {
  const classes = useStyles();

  const [authUser, authLoading] = useAuthState(firebase.auth());

  const userReference = firebase
    .firestore()
    .collection("users")
    .doc(authUser.uid);

  const [firestoreUser, firestoreLoading] =
    useDocumentData<User>(userReference);

  const [showAddTag, setShowAddTag] = useState<boolean>(false);

  const addTag = (tagToAdd: string) => {
    // Add tag to client collection
    if (!tags) {
      userReference
        .collection("clients")
        .doc(clientID)
        .set({ tags: [tagToAdd] }, { merge: true });
    } else if (!tags.includes(tagToAdd)) {
      userReference
        .collection("clients")
        .doc(clientID)
        .set({ tags: [...tags, tagToAdd] }, { merge: true });
    }

    // Add tag to user collection
    if (!firestoreUser.userTags) {
      userReference.set({ userTags: [tagToAdd] }, { merge: true });
    } else if (!firestoreUser.userTags.includes(tagToAdd)) {
      userReference.set(
        { userTags: [...firestoreUser.userTags, tagToAdd] },
        { merge: true }
      );
    }
  };

  // delete tag from user collection
  const deleteTag = (tagToDelete: string) => () =>
    userReference
      .collection("clients")
      .doc(clientID)
      .set(
        { tags: tags.filter((tag) => tag !== tagToDelete) },
        { merge: true }
      );

  // initialise textFieldValue to "", update using setTFV...
  const [textFieldValue, setTextFieldValue] = useState<string>("");

  // const handleTextFieldChange = (
  //   event: React.ChangeEvent<HTMLInputElement> // event = input of element is changed
  // ) => {
  //   console.log("Text field set to", event.target.value );
  //   setTextFieldValue(event.target.value); // set to that value
  // };

  const handleAutoFillFieldChange = (
    event: React.ChangeEvent<HTMLInputElement> , value: string) => {
    setTextFieldValue(value); // set to that value
  };

  // Add the tag if enter is pressed on the keyboard
  const handleEnterTag = (event) => {

    if ((event.which || event.charCode || event.keyCode) == 13){
      addTag(textFieldValue); // Add tag
      setTextFieldValue(""); // Reset field value
    }
  };


  if (authLoading || firestoreLoading) {
    return <></>;
  }

  return (
    <>
      {/* <Typography variant="caption">Tags:</Typography> */}
      <div className={classes.root}>
        {tags &&
          tags.map((tag, idx) => (
            <Chip
              key={idx}
              label={tag}
              onDelete={deleteTag(tag)}
              className={classes.chip}
            />
          ))}
        <Chip
          label={showAddTag ? <RemoveIcon /> : <AddIcon />} // Changing the icon for adding tags
          color="primary"
          onClick={() =>
            showAddTag ? setShowAddTag(false) : setShowAddTag(true)
          }
          className={classes.chip}
        />

        {showAddTag && ( //if adding tags is shown

          // Autofill already existing tags
          <Autocomplete
            freeSolo
            fullWidth
            clearOnBlur
            clearOnEscape
            options={firestoreUser.userTags.map((tag) => tag)} // show all existing tags as autofill
            onInputChange={handleAutoFillFieldChange} // When changed, update textfieldvalue
            onKeyPress={handleEnterTag} // Add tag when Enter key is pressed
            inputValue={textFieldValue}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Add Tag"
                margin="normal"
                size="small"
                // onChange={handleTextFieldChange} //when changed, update textFieldValue
                // onKeyPress={handleEnterTag}
                InputProps={{
                  ...params.InputProps,
                  style: { backgroundColor: "white" },
                  endAdornment: (
                    <>
                    {/*Add tag button*/}
                    <InputAdornment component="div" position="end">
                      <IconButton
                        onClick={() => {
                          //When clicked, add the tag and reset textFieldValue
                          addTag(textFieldValue);
                          setTextFieldValue("");
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                  </InputAdornment>
                  </>
                  )
                }}
              />
            )}
          />
          
        )}
      </div>
    </>
  );
};

export default Tags;
