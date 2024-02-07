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
  cy.get("aside").then(($body) => {
    if ($body.find("#button-connect-wallet").length > 0) {
      console.log("not connected");

      cy.contains("Connect Wallet").click();
      cy.get("div#modal-backdrop").within(() => {
        return cy.get("button").eq(0).click(); // injected provider wallet is the first one
      });
    } else {
      // Element does not exist, do something else
      console.log("already connected");
    }
  });
});

Cypress.Commands.add("delegatePower", (delegate?: string) => {
  cy.visit("http://localhost:3000/delegate");
  cy.connectWallet();
  cy.wait(500); // wait to load props values

  if (delegate) {
    cy.get("#input-delegate-power").type(delegate);
    console.log("type");
  } else {
    // self delegate
    cy.get("#button-use-my-address-power").click({ force: true });
  }

  cy.get("#button-delegate-power").click({ force: true });
  cy.wait(500);
  cy.reload();
});

Cypress.Commands.add("delegateZero", (delegate?: string) => {
  cy.visit("http://localhost:3000/delegate");
  cy.connectWallet();
  cy.wait(500); // wait to load props values

  if (delegate) {
    cy.get("#input-delegate-zero").type(delegate);
    console.log("type");
  } else {
    // self delegate
    cy.get("#button-use-my-address-zero").click({ force: true });
  }

  cy.get("#button-delegate-zero").click({ force: true });
  cy.wait(500);
  // cy.reload();
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

Cypress.Commands.add("castYesOneProposal", (description: string) => {
  cy.visit("http://localhost:3000/proposals/");
  cy.connectWallet();
  cy.wait(500);

  cy.contains("article", description).then(($proposal) => {
    cy.wrap($proposal).find("#button-cast-yes").click();
  });

  cy.get("#button-cast-submit").click();

  cy.get("[data-test='voted']").should("have.length", 1);
});

Cypress.Commands.add("castYesAllProposals", () => {
  cy.visit("http://localhost:3000/proposals/");
  cy.connectWallet();
  cy.wait(500);

  cy.get("[data-test='button-cast-yes']").each(($btn) => {
    cy.wrap($btn).click();
  });

  cy.get("#button-cast-submit").click();
});

Cypress.Commands.add(
  "castYesOneOptionalProposal",
  (description: string, page?: string) => {
    cy.visit(`http://localhost:3000/proposals/${page}`);
    cy.connectWallet();
    cy.wait(500);

    cy.contains("article", description).then(($proposal) => {
      cy.wrap($proposal).find("#button-cast-yes").click();
    });

    cy.get("[data-test='voted']").should("have.length", 1);
  }
);

Cypress.Commands.add("executeOneProposal", (description: string) => {
  cy.mineEpochs(1);

  cy.visit("http://localhost:3000/proposals/succeeded");
  cy.connectWallet();

  cy.reload();

  cy.contains("article", description).then(($proposal) => {
    cy.wrap($proposal).find("#button-proposal-execute").click();
  });

  cy.wait(500);
});

Cypress.Commands.add("clickPreviewProposal", (quantity: number) => {
  cy.get("[data-test='create-proposal-button-preview']")
    .should("exist")
    .click();
});

Cypress.Commands.add("mineEpochs", (quantity: number) => {
  const _EPOCH_PERIOD = 33;
  const blocks = _EPOCH_PERIOD * quantity;
  cy.task("mine", blocks).then((obj) => {
    console.log("mined", blocks);
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
