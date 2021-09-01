import Account from "./components/Account/Account";
import SignUp from "./components/Account/Signup";
import Client from "./components/Client/Client";
import Home from "./components/Home";
import Loading from "./components/Loading";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch, RouteProps } from "react-router-dom";

type AuthenticatedRouteProps = RouteProps & {
  user: firebase.User | undefined;
};

const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
  const { user, ...routeProps } = props;
  if (user) {
    return <Route {...routeProps} />;
  }

  return <Redirect to="/account" />;
};

const Router = () => {
  const [user, loading] = useAuthState(firebase.auth());

  if (loading) {
    return <Loading />;
  }

  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/account" component={Account} />
      <AuthenticatedRoute
        exact
        path="/client/:clientId"
        component={Client}
        user={user}
      />

      <AuthenticatedRoute path="/" component={Home} user={user} />
    </Switch>
  );
};

export default Router;
