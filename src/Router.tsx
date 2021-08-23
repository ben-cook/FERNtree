import Account from "./components/Account/Account";
import SignUp from "./components/Account/Signup";
import Home from "./components/Home";
import Loading from "./components/Loading";
import NewClient from "./components/NewClient/NewClient";
import firebase from "firebase/app";
import { ReactElement } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Redirect, Route, Switch, RouteProps } from "react-router-dom";

type AuthenticatedRouteProps = RouteProps & {
  user: firebase.User | undefined;
  component: (props: RouteProps) => ReactElement;
};

const AuthenticatedRoute = (props: AuthenticatedRouteProps) => {
  const { user, component: Component, ...rest } = props;
  if (user) {
    return <Component {...rest} />;
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
        path="/client/new"
        component={NewClient}
        user={user}
      />

      <AuthenticatedRoute path="/" component={Home} user={user} />
    </Switch>
  );
};

export default Router;
