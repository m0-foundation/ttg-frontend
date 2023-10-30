describe("Proposals", () => {
  describe("type action: setProposalFeeRange", () => {
    const newFee = "0.002";
    const minFee = "0.001";
    const maxFee = "0.008";
    const description = `Set proposal fee range to ${minFee}-${maxFee} and new fee = ${newFee} $CASH`;
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Fee").click();
      cy.contains("Change fee range").click();

      cy.get("input[data-test='proposalValue']").type(minFee);
      cy.get("input[data-test='proposalValue2']").type(maxFee);
      cy.get("input[data-test='proposalValue3']").type(newFee);

      cy.get("textarea[data-test='description']").type(description);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.wait(500);
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", minFee);
      cy.get("#technical-proposal-incoming-change").should("contain", maxFee);
      cy.get("#technical-proposal-incoming-change").should("contain", newFee);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-current").should("contain", minFee);
      cy.get("#technical-proposal-current").should("contain", maxFee);
      cy.get("#technical-proposal-current").should("contain", newFee);
    });
  });
});
