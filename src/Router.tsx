import Account from "./components/Account/Account";
import SignUp from "./components/Account/Signup";
import Home from "./components/Home";
import NewClient from "./components/NewClient/NewClient";
import { Route, Switch } from "react-router-dom";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/client/new" component={NewClient} />

      <Route path="/" component={Home} />
    </Switch>
  );
};

export default Router;
