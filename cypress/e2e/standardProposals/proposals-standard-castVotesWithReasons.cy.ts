import { randomNumber } from "../../lib/random-number";

describe("Standard: cast votes with reason", () => {
  it("I should be able to CREATE a proposal - guidance", () => {
    const input =
      "5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8";
    const description = `Add protocol guidance:${input}`;

    cy.visit("/proposal/create");

    cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='protocolGuidanceSetKey']").should("exist").click();
    cy.get("[data-test='guidance-types-select']").click();
    cy.contains("Adopted guidance").click();

    cy.get("input[data-test='proposalValue2']").type(input);
    cy.get("input[data-test='title']").type(description);

    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should be able to CREATE a proposal - update colateral", () => {
    const input = randomNumber(60, 3153600); // accepted range
    const description = `Add Update collateral interval:${input}`;

    cy.visit("/proposal/create");

    cy.connectWallet();

    cy.get("[data-test='proposalTypeSelect']").should("exist").click();

    cy.get("[data-test='protocolSetKey']").should("exist").click();
    cy.get("[data-test='protocolConfigSelect']").click();
    cy.contains("Update collateral interval").click();

    cy.get("input[data-test='proposalValue2']").type(input.toString());
    cy.get("input[data-test='title']").type(description);

    cy.createProposalAddDescription(description);

    cy.clickPreviewProposal();

    cy.clickSubmitProposal();
  });

  it("I should see the created proposals", () => {
    cy.mineEpochs(2);
    cy.wait(500);
    cy.visit("/proposals/");

    cy.get("[data-test='proposal-card']").should("have.length", 2);
  });

  it("I should be able to GIVE REASONS and CAST votes for proposals", () => {
    cy.visit("/proposals/");

    cy.get("[data-test='button-cast-yes']").each(($btn) => {
      cy.wrap($btn).click();
    });
    cy.get("[data-test='reason-vote-checkbox']").each(($btn) => {
      cy.wrap($btn).click();
    });
    cy.get("[data-test='reason-vote-textarea']").each(($btn, index) => {
      cy.wrap($btn).type("REASON " + index);
    });

    cy.get("#button-cast-submit").click();
    cy.get("[data-test='voted']").should("have.length", 2);
  });
});
