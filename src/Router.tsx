import Login from "./components/Account/Login";
import SignUp from "./components/Account/Signup";
import Home from "./components/Home";
import { Route, Switch } from "react-router-dom";

const Router = () => {
  return (
    <Switch>
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route path="/" component={Home} />
    </Switch>
  );
};

export default Router;
