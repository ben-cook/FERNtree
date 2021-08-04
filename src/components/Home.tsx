import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Home = () => {
  // Get a refernce to the 'example' collection of documents
  const exampleCollectionReference = firebase.firestore().collection("example");

  // Get all the documents in the collection
  const [examples] = useCollectionData(exampleCollectionReference);

  return (
    <>
      {/* Map over ever document in the collection and display it on the page */}
      {examples?.map((example, idx) => (
        <p key={idx}>{example.testField}</p>
      ))}
    </>
  );
};

export default Home;
