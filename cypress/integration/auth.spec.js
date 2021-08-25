/// <reference types="cypress" />

const exampleEmail = `test@testies.com`;
const examplePassword = `testtest`;

describe("Basic Authentication", () => {
  before(() => {
    // We want to clear any auth related cookies that are stored across testing sessions
    cy.clearLocalStorage();
    cy.clearCookies();
    indexedDB.deleteDatabase("firebaseLocalStorageDb");
  });

  it("has a title", () => {
    cy.visit("/account", { timeout: 25000 });
    cy.contains("Welcome back to Ferntree!");
  });

  it("can log in using UI", () => {
    cy.visit("/account");
    cy.get("[data-cy=email]").type(exampleEmail);
    cy.get("[data-cy=password]").type(examplePassword);
    cy.get("[data-cy=submit]").click();
    cy.contains("Account Details");
  });

  it("can log out using UI", () => {
    cy.get("[data-cy=logout]").click();
    cy.contains("Welcome back to Ferntree!");
  });

  it("blocks authenticated routes", () => {
    cy.visit("/client/new");
    cy.url().should("eq", "http://localhost:3000/account");
  });

  it("can't log in to user with fake email and password", () => {
    cy.visit("/account");
    cy.get("[data-cy=email]").type("bademail@kjashdkabskda.asjdkla");
    cy.get("[data-cy=password]").type("alsjdhnaoujbwdajhd");
    cy.get("[data-cy=submit]").click();
    cy.contains("Incorrect username or password.");
    cy.contains("Welcome back to Ferntree!");
  });
});
