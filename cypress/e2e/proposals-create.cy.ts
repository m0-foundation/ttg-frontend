/* eslint-disable require-await */

describe("Governance", async () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/proposals/create");
  });

  it("create proposal for type action: changeTax", () => {
    cy.task("hardhat").then(() => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Tax").click();
      cy.contains("Change Tax").click();

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

  it("create proposal for type action: changeTaxRange", () => {
    cy.task("hardhat").then(() => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Tax").click();
      cy.contains("Change Tax range").click();

      cy.get("input[data-test='proposalValue']").type("2");
      cy.get("input[data-test='proposalValue2']").type("8");

      cy.get("textarea[name='description']").type(
        "Change Tax Range to 2x - 8x"
      );

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });
  });

  it("create proposal for type action: updateVoteQuorumNumerator", () => {
    cy.task("hardhat").then(() => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Change Quorums").should("exist");
      cy.contains("Change Quorums").click();

      cy.contains("Vote Quorum").should("exist");
      cy.contains("Vote Quorum").click();

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "number"
      );
      cy.get("input[data-test='proposalValue']").type("10");

      cy.get("textarea[name='description']").type(
        "Change Vote Quorum Numerator to 10%"
      );

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });
  });

  it("create proposal for type action: updateValueQuorumNumerator", () => {
    cy.task("hardhat").then(() => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Change Quorums").should("exist");
      cy.contains("Change Quorums").click();

      cy.contains("Value Quorum").should("exist");
      cy.contains("Value Quorum").click();

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "number"
      );
      cy.get("input[data-test='proposalValue']").type("10");

      cy.get("textarea[name='description']").type(
        "Change Value Quorum Numerator to 10%"
      );

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });
  });
});
