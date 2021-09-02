import Account from "./components/Account/Account";
import SignUp from "./components/Account/Signup";
import Category from "./components/Category/Category";
import Client from "./components/Client/Client";
import Home from "./components/Home/Home";
import Loading from "./components/Loading";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch, RouteProps } from "react-router-dom";

const Router = () => {
  const [user, loading] = useAuthState(firebase.auth());

  if (loading) {
    return <Loading />;
  }

  const AuthenticatedRoute = (props: RouteProps) =>
    user ? <Route {...props} /> : <Redirect to="/account" />;

  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/account" component={Account} />
      <AuthenticatedRoute exact path="/client/:clientId" component={Client} />
      <AuthenticatedRoute
        exact
        path="/category/:categoryName"
        component={Category}
      />

      <AuthenticatedRoute path="/" component={Home} />
    </Switch>
  );
};

export default Router;
