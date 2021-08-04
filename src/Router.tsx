import { Route, Switch } from "react-router-dom";

import SignUp from "./components/Account/Signup";
import Home from "./components/Home";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route path="/" component={Home} />
    </Switch>
  );
};

export default Router;
