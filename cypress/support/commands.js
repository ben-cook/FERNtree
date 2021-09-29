Cypress.Commands.add("login", (email, password) => {
  cy.intercept("POST", "https://www.googleapis.com/identitytoolkit/**").as(
    "logIn"
  );

  cy.visit("/account");
  cy.get("[data-cy=email]").type(email);
  cy.get("[data-cy=password]").type(password);
  cy.get("[data-cy=submit]").click();

  cy.wait("@logIn");
  cy.wait("@logIn");
});
