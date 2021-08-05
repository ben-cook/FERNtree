import { Box, Button, Typography } from "@material-ui/core";
import firebase from "firebase/app";

const UserDetails = (user: firebase.User) => {
  return (
    <Box>
      <Typography>email: {user?.email}</Typography>
      <Typography>verified: {user?.emailVerified ? "yes" : "no"}</Typography>

      <Button onClick={() => firebase.auth().signOut()}>Sign Out</Button>
      <Button
        onClick={() => {
          firebase
            .auth()
            .currentUser?.delete()
            .then(() => console.log("deleted account"))
            .catch((err) => console.error(err));
        }}
      >
        Delete Account
      </Button>
    </Box>
  );
};

export default UserDetails;
