import firebase from "firebase/app";

export interface TypedHttpsCallable<T> {
  (data: T): Promise<firebase.functions.HttpsCallableResult>;
}
