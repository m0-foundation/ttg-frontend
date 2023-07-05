/* eslint-disable require-await */

describe("Proposals", async () => {
  describe("As a user with $TAX", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000/proposals/create");
    });

    describe("Is Quorum Operation", () => {
      it("I should be able to a create proposal for type action: updateVoteQuorumNumerator", () => {
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

      it("I should be able to a create proposal for type action: updateValueQuorumNumerator", () => {
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

    describe("Is Tax Operation", () => {
      it("I should be able to a create proposal for type action: changeTax", () => {
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

      it("I should be able to a create proposal for type action: changeTaxRange", () => {
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

    describe("Is List Operation", () => {
      it("I should be able to a create proposal for type action: Create a new list", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("List").should("exist").click();

        cy.contains("Create a new list").should("exist");
        cy.contains("Create a new list").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type("Collateral Managers");

        cy.get("textarea[name='description']").type(
          "Add the Collateral Managers list"
        );

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 4);
        });
      });

      it("I should be able to a create proposal for type action: Append to a list", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("List").should("exist").click();

        cy.contains("Append to a list").should("exist").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type(
          "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        cy.get("input[data-test='proposalValue2']").type(
          "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );

        cy.get("textarea[name='description']").type("Append to list");

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("I should be able to a create proposal for type action: Remove from a list", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("List").should("exist").click();

        cy.contains("Remove from a list")
          .should("exist")
          .click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type(
          "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        cy.get("input[data-test='proposalValue2']").type(
          "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );

        cy.get("textarea[name='description']").type("Remove from a list");

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

    describe("Is Emergency Proposal", () => {
      it("I should be able to a create an Emergency proposal for type action: Append", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Emergency").should("exist");
        cy.contains("Emergency").click();

        cy.contains("Append to a list").should("exist").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type(
          "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        cy.get("input[data-test='proposalValue2']").type(
          "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        // cy.get("input[data-test='proposalValue3']").type("0x01ffc9a7");

        cy.get("textarea[name='description']").type("Emergency append to list");

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("I should be able to a create an Emergency proposal for type action: Remove", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Emergency").should("exist");
        cy.contains("Emergency").click();

        cy.contains("Remove from a list")
          .should("exist")
          .click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );
        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue']").type(
          "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        cy.get("input[data-test='proposalValue2']").type(
          "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );

        cy.get("textarea[name='description']").type(
          "Emergency remove from a list"
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

      it("I should be able to a create an Emergency proposal for type action: Chance Config", () => {
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Emergency").should("exist");
        cy.contains("Emergency").click();

        cy.contains("Change Config").should("exist").click({ force: true });

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue2']").should(
          "have.attr",
          "type",
          "text"
        );

        cy.get("input[data-test='proposalValue3']").should(
          "have.attr",
          "type",
          "text"
        );

        const configName = "inflator";
        // config Name
        cy.get("input[data-test='proposalValue']").type(configName);
        // config Address
        cy.get("input[data-test='proposalValue2']").type(
          "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
        );
        // interfaceId
        cy.get("input[data-test='proposalValue3']").type("0x01ffc9a7");

        cy.get("textarea[name='description']").type(
          `Emergency change config ${configName}`
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

    it("I should be able to a create  proposal for type action: Chance Config", () => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Change Config").should("exist").click({ force: true });

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "text"
      );

      cy.get("input[data-test='proposalValue2']").should(
        "have.attr",
        "type",
        "text"
      );

      cy.get("input[data-test='proposalValue3']").should(
        "have.attr",
        "type",
        "text"
      );

      const configName = "protocolFee";
      // config Name
      cy.get("input[data-test='proposalValue']").type(configName);
      // config Address
      cy.get("input[data-test='proposalValue2']").type(
        "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
      );
      // interfaceId
      cy.get("input[data-test='proposalValue3']").type("0x01ffc9a7");

      cy.get("textarea[name='description']").type(
        `Emergency change config ${configName}`
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

    it("I should be able to a create  proposal for type action: Reset", () => {
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Reset").should("exist").click({ force: true });

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "text"
      );

      const address = "0x1fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
      cy.get("input[data-test='proposalValue']").type(address);

      cy.get("textarea[name='description']").type(
        `Reset governance to this contract ${address}`
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
