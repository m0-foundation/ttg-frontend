describe("Proposals", () => {
  describe("type action: setProposalFee", () => {
    const input = "0.002";
    const description = "Change Proposal Fee to 0.002 $CASH";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.contains("Update proposal fee").click();

      cy.get("input[data-test='proposalValue']").type(input);
      cy.get("input[data-test='title']").type(description);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      cy.mineEpochs(2);

      cy.visit("/proposals/");

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
      cy.mineEpochs(1);
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", input);
    });
  });
});
