/* eslint-disable require-await */

describe("Governance", async () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/proposals/create");
  });

  it("create proposal for type action: Change Tax", () => {
    cy.task("hardhat").then(() => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Change tax").should("exist");
      cy.contains("Change tax").click();

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "number"
      );
      cy.get("input[data-test='proposalValue']").type("10");

      cy.get("textarea[name='description']").type("Change tax to 10x");

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(async ($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });
  });
});
