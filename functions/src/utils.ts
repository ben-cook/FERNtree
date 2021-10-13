// https://medium.com/swlh/using-firestore-with-typescript-65bd2a602945
import { User, Client } from "./types";
import * as admin from "firebase-admin";

admin.initializeApp();

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T
});

const dataPoint = <T>(collectionPath: string) =>
  admin.firestore().collection(collectionPath).withConverter(converter<T>());

export const db = {
  users: dataPoint<User>("users"),
  userClients: (userId: string) => dataPoint<Client>(`users/${userId}/clients`)
};
