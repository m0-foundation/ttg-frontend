describe("Proposals", () => {
  describe("type action: setProposalFee", () => {
    const input = "0.002";
    const description = "Change Proposal Fee to 0.002 $CASH";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.contains("Proposal Fee").click();

      cy.get("input[data-test='proposalValue']").type(input);
      cy.get("input[data-test='title']").type(description);

      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      // FIRST epoch is Voting type but recenlty created non-emergency proposals can only be voted
      // in the next Voting type epoch, thus must skip 1 epoch of Transfer only until the next epoch of Voting
      cy.mineEpochs(2);

      cy.wait(1000);
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input);

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
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", input);
    });
  });
});
