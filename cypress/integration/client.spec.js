/// <reference types="cypress" />
import Chance from "chance";

const exampleEmail = `test@testies.com`;
const examplePassword = `testtest`;

const chance = new Chance();

describe("Create a new Client", () => {
  before(() => {
    // We want to clear any auth related cookies that are stored across testing sessions
    cy.clearLocalStorage();
    cy.clearCookies();
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  });

  const [firstName, lastName] = chance.name().split(" ");
  const email = chance.email();

  it("signs in ", () => {
    cy.login(exampleEmail, examplePassword);
  });

  it("creates new client", () => {
    cy.intercept(
      "POST",
      "https://firestore.googleapis.com/google.firestore.v1.Firestore/**"
    ).as("writesToFirestore");

    cy.visit("/client/new");
    cy.get("[name=firstName]").type(firstName);
    cy.get("[name=lastName]").type(lastName);
    cy.get("[name=email]").type(email);
    cy.get("[data-cy=submit]").click();

    cy.wait("@writesToFirestore");
  });

  it("client shows up in main page", () => {
    cy.contains("New client created");
    cy.contains(firstName);
    cy.contains(lastName);
  });

  it("can delete client", () => {
    // Navigate to client page
    cy.get(`[data-cy=${firstName}${lastName}]`).click();

    // Delete client
    cy.get("[data-cy=delete-button]").click();
    cy.get("[data-cy=confirm-delete]").click();
  });

  it("client does not show up in main page", () => {
    cy.contains("Client deleted");

    cy.intercept(
      "POST",
      "https://firestore.googleapis.com/google.firestore.v1.Firestore/**"
    ).as("getFirestoreData");

    cy.wait("@getFirestoreData");

    cy.contains("Client deleted");
    cy.contains(firstName).should("not.exist");
    cy.contains(lastName).should("not.exist");
  });
});
