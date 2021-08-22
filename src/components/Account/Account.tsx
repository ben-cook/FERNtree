import UserDetails from "./Account Details/UserDetails";
import Login from "./Login";
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
