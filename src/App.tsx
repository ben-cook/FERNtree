import "./App.css";

import Header from "./components/Header";
import { Container } from "@material-ui/core";
import Router from "./Router";

const App = () => {
  return (
    <div className="App">
      <Header />

      <Container>
        <Router />
      </Container>
    </div>
  );
};

export default App;
