import Login from "./Login";
import UserDetails from "./UserDetails";
import firebase from "firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Account = () => {
  const [user] = useAuthState(firebase.auth());

  return (
    <>
      {!user && <Login />}
      {user && <UserDetails {...user} />}
    </>
  );
};

export default Account;
