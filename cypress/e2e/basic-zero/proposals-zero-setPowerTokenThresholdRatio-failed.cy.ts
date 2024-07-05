describe("Proposals", () => {
  describe("type action: setThresholdRatio should fail", () => {
    const input1 = "15";
    const description = "Set Power Token Threshold Ratio to 15";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {

      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.contains("Update power threshold").click();

      cy.get("input[data-test='proposalValue']").type(input1);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });



    it("I should be able to see error on  vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "zero");

      cy.get(".alert", {timeout: 3000}).should("contain.text", 'Transaction not sent! The contract function "castVote" reverted.');
      
    }); 
  });
});
