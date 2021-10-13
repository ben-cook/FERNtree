import { IAddTagData, IDeleteTagData } from "./types";
import { db } from "./utils";
import * as functions from "firebase-functions";

// admin.initializeApp();

// https://firebase.google.com/docs/functions/callable#web-version-8_2

// Add a tag to a client
exports.addTag = functions
  .region("australia-southeast1")
  .https.onCall(async (data: IAddTagData, context) => {
    try {
      const { clientID, tag: tagToAdd } = data;
      const { auth } = context;

      if (!auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
          "failed-precondition",
          "The function must be called while authenticated."
        );
      }

      if (tagToAdd === "") {
        return;
      }

      // Write the tag to the client document.
      const clientDocumentReference = db.userClients(auth.uid).doc(clientID);
      const clientDocument = await clientDocumentReference.get();
      const client = await clientDocument.data();

      if (!client) {
        throw new functions.https.HttpsError(
          "not-found",
          "The client could not be found."
        );
      }

      // Update the client document
      if (!client.tags) {
        clientDocumentReference.update({ tags: [tagToAdd] });
      } else if (!client.tags.includes(tagToAdd)) {
        clientDocumentReference.update({ tags: [...client.tags, tagToAdd] });
      }

      // Update the userTags on the user document
      const userDocumentReference = db.users.doc(auth.uid);
      const userDocument = await userDocumentReference.get();
      const user = await userDocument.data();

      // Add tag to user collection
      if (user) {
        if (!user.userTags) {
          userDocumentReference.update({ userTags: [tagToAdd] });
        } else if (!user.userTags.includes(tagToAdd)) {
          userDocumentReference.update({
            userTags: [...user.userTags, tagToAdd]
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.log(error);
      throw new functions.https.HttpsError("internal", "Something went wrong");
    }
  });

// Delete a tag from a client
exports.deleteTag = functions
  .region("australia-southeast1")
  .https.onCall(async (data: IDeleteTagData, context) => {
    try {
      const { clientID, tag: tagToDelete } = data;
      const { auth } = context;

      if (!auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError(
          "failed-precondition",
          "The function must be called while authenticated."
        );
      }

      // Delete the tag from the client document.
      const clientDocumentReference = db.userClients(auth.uid).doc(clientID);
      const clientDocument = await clientDocumentReference.get();
      const client = await clientDocument.data();

      if (!client) {
        throw new functions.https.HttpsError(
          "not-found",
          "The client could not be found."
        );
      }

      // Update the client document
      if (client.tags && client.tags.includes(tagToDelete)) {
        clientDocumentReference.update({
          tags: client.tags.filter((existingTag) => existingTag !== tagToDelete)
        });
      }

      // Update the userTags on the user document
      const userDocumentReference = db.users.doc(auth.uid);
      const userDocument = await userDocumentReference.get();
      const user = await userDocument.data();

      const allClientsDocuments = await db.userClients(auth.uid).get();
      const allClients = allClientsDocuments.docs.map((doc) => doc.data());

      // Remove tag from user collection if it doesn't exist on any clients
      if (user && user.userTags) {
        const existsOnClient = allClients.some(
          (client) => client.tags && client.tags.includes(tagToDelete)
        );
        if (!existsOnClient) {
          userDocumentReference.update({
            userTags: user.userTags.filter(
              (existingTag) => existingTag !== tagToDelete
            )
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.log(error);
      throw new functions.https.HttpsError("internal", "Something went wrong");
    }
  });
