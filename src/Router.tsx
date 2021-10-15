import Account from "./components/Account/Account";
import Category from "./components/Category/Category";
import Client from "./components/Client/Client";
import Home from "./components/Home/Home";
import Loading from "./components/Loading";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch, RouteProps } from "react-router-dom";

const Router = () => {
  const [user, loading] = useAuthState(firebase.auth());

  if (loading) {
    return <Loading />;
  }

  const AuthenticatedRoute = (props: RouteProps) =>
    user ? <Route {...props} /> : <Redirect to="/" />;

  return (
    <Switch>
      <AuthenticatedRoute
        exact
        path="/account"
        render={() => <Account {...user} />}
      />
      <AuthenticatedRoute exact path="/client/:clientId" component={Client} />
      <AuthenticatedRoute
        exact
        path="/category/:categoryName"
        component={Category}
      />

      <Route exact path="/signup" component={SignUp} />
      <Route path="/" component={user ? Home : Login} />
    </Switch>
  );
};

export default Router;
