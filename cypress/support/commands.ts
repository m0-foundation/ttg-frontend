// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("connectWallet", () => {
  cy.contains("Connect Wallet").click();
  cy.get("div#modal-backdrop").within(() => {
    return cy.get("button").eq(1).click(); // injected provider wallet is the first one
  });
});

Cypress.Commands.add("delegateToMe", (testId) => {
  // check if delegate button exists
  cy.contains("button", "Delegate to me").then(($el) => {
    cy.wrap($el).click();

    cy.task("mine", 5).then((obj) => {
      console.log("mined", { obj });
    });
    cy.wait(500);
    cy.reload();
  });
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
