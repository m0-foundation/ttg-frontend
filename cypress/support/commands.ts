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

Cypress.Commands.add("delegateVote", () => {
  cy.visit("http://localhost:3000/delegate");
  cy.wait(500); // wait to load props values
  cy.get("#button-use-my-address-vote").click({ force: true });
  cy.get("#button-delegate-vote").click({ force: true });
  cy.wait(500);
  cy.reload();
});

Cypress.Commands.add("delegateValue", () => {
  cy.visit("http://localhost:3000/delegate");
  cy.wait(500); // wait to load props values
  cy.get("#button-use-my-address-value").click({ force: true });
  cy.get("#button-delegate-value").click({ force: true });
  cy.wait(500);
  cy.reload();
});

Cypress.Commands.add("executeProposal", (proposalUrl: string) => {
  cy.visit(proposalUrl);
  cy.get("#proposal-state").should("contain", "succeeded");
  cy.contains("article", "Execute?").should("exist");
  cy.get("#button-proposal-execute").click();
  cy.wait(500);

  cy.task("mine", 10);
  cy.wait(500);
  cy.reload();
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
