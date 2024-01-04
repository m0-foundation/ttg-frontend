describe("Proposals", () => {
  describe("Emergency proposal for type action: AddToList", () => {
    const description =
      "Reset Zero - when executed new governor and power token are auto-deployed and the values in registrar are overwritten";

    it("I should be able to CREATE a proposal to Reset", () => {
      // zero proposals cant be created on first epoch
      cy.mineEpochs(2);

      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='resetMenu']").click();
      cy.get("[data-test='resetToZeroHolders']").click();

      cy.get("input[data-test='proposalValue']").should("not.exist");

      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the proposal", () => {
      // reset does not need to forward to next epoch, it will be able to vote on same epoch
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description);
    });

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
      cy.reload();
      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.connectWallet();

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.wait(500);
    });
  });
});
