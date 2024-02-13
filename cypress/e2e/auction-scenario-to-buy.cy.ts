describe("Auction", () => {
  describe("Create Sceneario to buy in Auction", () => {
    const input = "0.001";
    const title = "Change Proposal Fee";
    const description = "Auction Scenario to buy.";

    it("I should be able to CREATE a proposal", () => {
      cy.mineEpochs(2);
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

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.mineEpochs(2);
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to SEE Power Tokens available on auction", () => {
      cy.visit("http://localhost:3000/auction/");
      cy.get("[data-test='power-token-available']").should("exist");
    });
  });
});
