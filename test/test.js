import { initializeTestApp, initializeAdminApp, assertSucceeds, assertFails } from '@firebase/testing';

// variables to store various parameters
const MY_PROJECT_ID = "mernda-express"
const myId = "Rick";
const anotherId = "Morty";
const myAuth = {uid: myId, email: "rick@rick.com"};

// setup function for emulated database
function getFirestore(auth) {
    return initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

// create a test document as a database admin, bypassing security rules 
function makeDocument(id) {
    const admin = initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
    admin.collection("users").doc(id).set({userId: anotherId});

} 

// test suits, containing unit tests described by the <it("...")>, to be read as "it (the app) ... can..."
describe("FERNTree", () => {

    it("Can write to a user document with the same ID as a user", async() => {
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(myId);
        await assertSucceeds(testDoc.set({foo: "bar"}));
    })

    it("Will deny a write operation if the user is not logged in", async() => {
        // no auth object is passed to represent unauthenticated access
        const db = getFirestore(null); 
        const testDoc = db.collection("users").doc("testies")
        await assertFails(testDoc.set({foo: "bar"}))
    })

    it("Will deny an attempt to write another user's data", async() => {
        // create a test document separate from user authenticated context
        makeDocument(anotherId);
        // create a database instance as authenticated user attempting to edit another document
        const db = getFirestore(myAuth);
        const testDoc = db.collection("users").doc(anotherId);
        await assertFails(testDoc.set({foo: "baz"}));
    })

    it("Will allow a user to read their own documents", async () => {
        const db = getFirestore(myAuth)
        const testDoc = db.collection("users").doc(myId)
        await assertSucceeds(testDoc.get());
    })

    it("Will deny a user reading another user's documents", async () => {
        makeDocument(anotherId);
        const db = getFirestore(myAuth)
        const testDoc = db.collection("users").doc(anotherId)
        await assertFails(testDoc.get());
    })

    it("Will deny a read request when not authenticated", async () => {
        const db = getFirestore(null)
        // set these documents as admin
        const testDoc = db.collection("users").doc(myId);
        await assertFails(testDoc.get());
    })

})

