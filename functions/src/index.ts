// import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// admin.initializeApp();
// const firestore = admin.firestore();

// https://firebase.google.com/docs/functions/callable#web-version-8_2

exports.ping = functions.https.onCall(
  (_data: Record<string, never>, _context) => {
    return { pong: true };
  }
);

exports.updateClient = functions.https.onCall(
  (_data: Record<string, never>, _context) => {
    return { pong: true };
  }
);
