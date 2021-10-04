import firebase from "firebase/app";
import { useEffect, useState } from "react";

const Testing = () => {
  const [data, setData] = useState<any>(null);
  const ping = firebase.functions().httpsCallable("ping");

  useEffect(() => {
    ping()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <p>testing</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Testing;
