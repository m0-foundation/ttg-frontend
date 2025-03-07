describe("Proposals", () => {
  describe("type action: setProposalFee", () => {
    const input = "0.002";
    const description = "Change Proposal Fee to 0.002 $CASH";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetStandardProposalFee']").click({
        force: true,
      });

      cy.get("input[data-test='proposalValue']").type(input);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      // FIRST epoch is Voting type but recently created non-emergency proposals can only be voted
      // in the next Voting type epoch, thus must skip 1 epoch of Transfer only until the next epoch of Voting
      // cy.mineEpochs(2);

      // cy.wait(1000);
      cy.reload();
      cy.visit("/proposals/priority");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal)
          .find("[data-test='proposal-button-show-details']")
          .click({ force: true });
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
      cy.castYesOneOptionalProposal(description, "priority");
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
