describe("Auction", () => {
  describe("Create Sceneario to buy in Auction", () => {
    const input = "0.001";
    const title = "Change Proposal Fee";
    const description = "Auction Scenario to buy.";

    it("I should be able to CREATE a proposal", () => {
      cy.mineEpochs(2);
      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Fee").click();
      cy.contains("Change fee").click();

      cy.get("input[data-test='proposalValue']").type(input);

      cy.get("input[data-test='title']").type(title);

      cy.get("textarea[data-test='description']").type(description);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.mineEpochs(4);
      cy.castYesOneProposal(description);
    });

    it("I should be able to SEE Power Tokens available on auction", () => {
      cy.mineEpochs(1);
      cy.visit("http://localhost:3000/auction/");
      cy.get("[data-test='power-token-available']").should("exist");
    });
  });
});
