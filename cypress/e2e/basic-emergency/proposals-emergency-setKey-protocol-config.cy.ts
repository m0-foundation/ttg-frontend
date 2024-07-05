describe("Proposals", () => {
  describe("type action: Emergency setKey", () => {
    const value = "1";
    const key = "mint_delay";
    const description = `Add config ${key} = ${value}`;
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      cy.contains("Mint delay").click();

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // cy.mineEpochs(2);
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch

      cy.visit("/proposals/emergency");
      cy.reload();

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", key);
      cy.get("#technical-proposal-incoming-change").should("contain", value);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "emergency");
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
    });
  });
});
