import "./App.css";
import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const App = () => {
  // Get a refernce to the 'example' collection of documents
  const exampleCollectionReference = firebase.firestore().collection("example");

  // Get all the documents in the collection
  const [examples] = useCollectionData(exampleCollectionReference);

  return (
    <div className="App">
      <h1>Mernda Express!</h1>

      {/* Map over ever document in the collection and display it on the page */}
      {examples?.map((example) => (
        <p>{example.testField}</p>
      ))}
    </div>
  );
};

export default App;
