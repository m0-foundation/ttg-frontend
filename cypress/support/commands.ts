/// <reference types="cypress" />
//
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
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      connectWallet(): Chainable;

      disconnectWallet(): Chainable;

      checkAppNavigation(): Chainable;

      delegatePower(delegate?: string): Chainable;

      delegateZero(delegate?: string): Chainable;

      executeProposal(proposalUrl: string): Chainable;

      castYesOneProposal(description: string, type?: string): Chainable;

      castYesAllProposals(): Chainable;

      castYesOneOptionalProposal(description: string, page?: string): Chainable;

      castYesOneEmergencyProposal(description: string): Chainable;

      castYesAllEmergencyProposals(): Chainable;

      executeAllProposals(): Chainable;

      executeOneProposal(description: string): Chainable;

      clickPreviewProposal(): Chainable;

      clickSubmitProposal(): Chainable;

      mineEpochs(quantity: number): Chainable;

      createProposalAddDescription(description: string): Chainable;

      validateEthAddress(address: string): Chainable;

      getButton(buttonText: string): Chainable;
    }
  }
}

Cypress.Commands.add("connectWallet", () => {
  cy.get("body").then(($body) => {
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

Cypress.Commands.add("checkAppNavigation", () => {
  const navbarList = '[data-test="main-navigation"] ul';

  cy.get(navbarList)
    .contains("a", "Home")
    .and("have.attr", "href", "/proposals");

  cy.get(navbarList)
    .contains("a", "Actors")
    .and("have.attr", "href", "/actors");

  cy.get(navbarList)
    .contains("a", "Proposals")
    .and("have.attr", "href", "/history");

  cy.get(navbarList)
    .contains("a", "Config")
    .and("have.attr", "href", "/config");
});

Cypress.Commands.add("disconnectWallet", () => {
  cy.get("aside").then(($body) => {
    if ($body.find("[data-test='sidebar-button-disconnect']").length > 0) {
      cy.log("connected, init disconnect");
      cy.get("[data-test='sidebar-button-disconnect']").click();
      cy.findByRole("button", { name: /Connect wallet/i }).should("be.visible");
    } else {
      // Element does not exist, do something else
      console.log("already disconnected");
    }
  });
});

Cypress.Commands.add("delegatePower", (delegate?: string) => {
  cy.visit("/delegate");
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
  cy.visit("/delegate");
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

Cypress.Commands.add("castYesOneProposal", (description: string, type = "") => {
  cy.visit(`/proposals/${type}`);
  cy.connectWallet();
  cy.wait(500);

  cy.contains("article", description).then(($proposal) => {
    cy.wrap($proposal).find("#button-cast-yes").click();
  });

  cy.get("#button-cast-submit").click();

  cy.get("[data-test='voted']").should("have.length", 1);
});

Cypress.Commands.add("castYesAllProposals", () => {
  cy.visit("/proposals/");
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
    cy.visit(`/proposals/${page}`);
    cy.connectWallet();
    cy.wait(500);

    cy.contains("article", description).then(($proposal) => {
      cy.wrap($proposal).find("#button-cast-yes").click();

      if (page !== "zero") {
        cy.get("#button-cast-submit").click();
      }
    });
  }
);

Cypress.Commands.add("castYesAllEmergencyProposals", () => {
  cy.visit("/proposals/priority");
  cy.connectWallet();
  cy.wait(500);

  cy.get("article").each(($proposal) => {
    cy.wrap($proposal).find("#button-cast-yes").click();
  });

  cy.get("#button-cast-submit").click();
});

Cypress.Commands.add("executeAllProposals", () => {
  cy.visit("/proposals/succeeded");
  cy.connectWallet();

  cy.get("article").each(($proposal) => {
    cy.wrap($proposal).find("#button-proposal-execute").click();
    cy.wait(500);
  });
});

Cypress.Commands.add("executeOneProposal", (description: string) => {
  // cy.mineEpochs(1);

  cy.visit("/proposals/succeeded");
  cy.connectWallet();

  // cy.reload();

  cy.contains("article", description).then(($proposal) => {
    cy.wrap($proposal).find("#button-proposal-execute").click();
  });

  cy.wait(500);
});

Cypress.Commands.add("clickPreviewProposal", () => {
  cy.get("[data-test='create-proposal-button-preview']")
    .should("exist")
    .click();
});

Cypress.Commands.add("clickSubmitProposal", () => {
  cy.get("[data-test='create-proposal-button-submit']").then(($el) => {
    cy.wrap($el).click();
    cy.get(".complete").invoke("text").should("contain", "Confirmation");
  });
});

Cypress.Commands.add("mineEpochs", (quantity: number) => {
  cy.task("mine", quantity).then((blocks) => {
    console.log("mined", blocks);
  });
});

Cypress.Commands.add("createProposalAddDescription", (description: string) => {
  cy.get(".md-editor-input-wrapper").find("[role='textbox']").type(description);
});

Cypress.Commands.add("validateEthAddress", (address: string) => {
  // string should be a valid eth address
  const result = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!result) {
    throw new Error(`Address ${address} is not a valid eth address`);
  }
});

Cypress.Commands.add("getButton", (buttonText) => {
  const regEx = new RegExp(buttonText, "i");
  cy.findByRole("button", { name: regEx });
});

export {};
