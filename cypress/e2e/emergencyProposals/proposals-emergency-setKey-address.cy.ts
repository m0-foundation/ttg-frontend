describe("Proposals", () => {
  describe("type action: setKey", () => {
    const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const key = "minter_rate_model";
    const description = `Add protocol config ${key} = ${value}`;

    it("I should be able to CREATE a proposal - Minter rate model ", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      // config
      cy.contains("Minter rate model").click();

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "emergency");
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit("/config/protocol");

      cy.contains(key);

      // address is shortened to 0xe7f1...3f0512
      // first six digits of the address
      cy.contains(value.toLowerCase().slice(0, 6));
      // last six digits of the address
      cy.contains(value.toLowerCase().slice(-6));
    });
  });
});
