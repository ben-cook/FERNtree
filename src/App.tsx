import Router from "./Router";
import Header from "./components/Header";
import { Container } from "@material-ui/core";

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
