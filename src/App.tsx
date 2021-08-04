import "./App.css";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Header from "./components/header";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";

const App = () => {
  // Get a refernce to the 'example' collection of documents
  const exampleCollectionReference = firebase.firestore().collection("example");

  // Get all the documents in the collection
  const [examples] = useCollectionData(exampleCollectionReference);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />

        {/* Map over ever document in the collection and display it on the page */}
        {examples?.map((example, idx) => (
          <p key={idx}>{example.testField}</p>
        ))}
      </div>
    </ThemeProvider>
  );
};

export default App;
