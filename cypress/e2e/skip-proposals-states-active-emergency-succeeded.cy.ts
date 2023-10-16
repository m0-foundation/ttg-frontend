describe.skip("Proposals", () => {
  describe("type action: setProposalFee", () => {
    const input1 = "0.002";
    const description1 = `Set proposal fee to ${input1} $CASH`;

    describe("Epoch 1", () => {
      it("I should be able to CREATE a proposal", () => {
        cy.visit("http://localhost:3000/proposal/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Fee").click();
        cy.contains("Change fee").click();

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "number"
        );

        cy.get("input[data-test='proposalValue']").type(input1);

        cy.get("div[data-test='description']").type(description1);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("Forward time to next Voting epoch", () => {
        cy.mineEpochs(2);
        cy.wait(500);
        cy.reload();
      });

      it("I should be able to ACCESS the ACTIVE proposal", () => {
        cy.visit("http://localhost:3000/proposals/active");

        cy.contains(description1).should("exist");

        cy.contains("article", description1).then(($proposal) => {
          cy.wrap($proposal).find("#show-details").click({ force: true });
        });

        cy.url().should("match", /proposal\/([0-9])\w+/g);
        cy.contains(".markdown-body", description1).should("exist");
        cy.wait(500); // wait to load props values

        cy.get("#technical-proposal-incoming-change").should("contain", input1);
      });

      it("I should be able to CAST vote YES for the proposal", () => {
        cy.castYesOneProposal(description1);
      });
    });

    describe("Epoch 3", () => {
      it("I should be able to CREATE a second proposal", () => {
        const input = "0.003";
        const description = `Set proposal fee to ${input} $CASH`;

        cy.visit("http://localhost:3000/proposal/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Fee").click();
        cy.contains("Change fee").click();

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "number"
        );

        cy.get("input[data-test='proposalValue']").type(input);

        cy.get("div[data-test='description']").type(description);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("I should be able to CREATE a third proposal", () => {
        const input = "0.004";
        const description = `Set proposal fee to ${input} $CASH`;

        cy.visit("http://localhost:3000/proposal/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Fee").click();
        cy.contains("Change fee").click();

        cy.get("input[data-test='proposalValue']").should(
          "have.attr",
          "type",
          "number"
        );

        cy.get("input[data-test='proposalValue']").type(input);

        cy.get("div[data-test='description']").type(description);

        cy.contains("Preview proposal").should("exist");
        cy.contains("Preview proposal").click();

        cy.connectWallet();

        cy.contains("Submit proposal").should("exist");
        cy.contains("Submit proposal").then(($el) => {
          $el.click();
          cy.get(".complete").should("have.length", 3);
        });
      });

      it("Forward in time to be able make it ACTIVE", () => {
        // forward in time to be able to vote
        cy.mineEpochs(2);
      });

      it("I should be able to CREATE a Emergency proposal to ADD an address to a list", () => {
        const input1 = "CollateralManagers";
        const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
        const description = `Emergency Add ${input2} to list ${input1}`;

        cy.visit("http://localhost:3000/proposal/create");
        cy.contains("Select a proposal type").should("exist");
        cy.contains("Select a proposal type").click();

        cy.contains("Emergency").should("exist").click({ force: true });

        cy.contains("Emergency Add to a list").should("exist");
        cy.contains("Emergency Add to a list").click({ force: true });

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

        // list address
        cy.get("input[data-test='proposalValue']").type(input1);
        // address to append
        cy.get("input[data-test='proposalValue2']").type(input2);

        cy.get("div[data-test='description']").type(description);

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
});
