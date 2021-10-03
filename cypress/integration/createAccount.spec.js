/// <reference types="cypress" />
import Chance from "chance";

const chance = new Chance();

describe("Register a new account", () => {
  before(() => {
    // We want to clear any auth related cookies that are stored across testing sessions
    cy.clearLocalStorage();
    cy.clearCookies();
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  });

  const [firstName, lastName] = chance.name().split(" ");
  const email = chance.email();
  const password = "examplePassword1234";

  it("signs up a new user", () => {
    cy.intercept("POST", "https://www.googleapis.com/identitytoolkit/**").as(
      "createAccount"
    );

    cy.visit("/account");
    cy.get("[data-cy=signup-link]").click();
    cy.url().should("eq", "http://localhost:3000/signup");
    cy.get("[data-cy=firstname]").type(firstName);
    cy.get("[data-cy=lastname]").type(lastName);
    cy.get("[data-cy=email]").type(email);
    cy.get("[data-cy=password]").type(password);
    cy.get("[data-cy=submit]").click();

    cy.wait("@createAccount");
    cy.wait("@createAccount");

    cy.get("[data-cy=profile-button]").click();
    cy.url().should("eq", "http://localhost:3000/account");
    cy.contains("Account Details");
    cy.contains(firstName);
    cy.contains(lastName);
    // cy.contains(email);
  });

  it("deletes created user", () => {
    cy.get("[data-cy=delete-button]").click();
    cy.get("[data-cy=confirm-delete]").click();
  });

  it("cannot log back into deleted user", () => {
    cy.contains("Welcome back to Ferntree!");

    cy.get("[data-cy=email]").type(email);
    cy.get("[data-cy=password]").type(password);
    cy.get("[data-cy=submit]").click();

    cy.contains("Incorrect username or password.");
  });
});
