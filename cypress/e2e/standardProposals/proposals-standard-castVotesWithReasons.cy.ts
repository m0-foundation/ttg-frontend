describe("Proposals", () => {
  describe("type action: castVotesWithReason", () => {
    const input = "5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8";
    const description = `Add protocol guidance:${input}`;

    const input2 = "1";
    const description2 = `Add Update collateral interval:${input2}`;

    it("I should be able to CREATE a proposal - guidance", () => {
      cy.visit("/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();
      
      cy.get("[data-test='protocolGuidanceSetKey']").should("exist").click();
      cy.get("[data-test='guidance-types-select']").click();
      cy.contains("Adopted guidance").click();

      cy.get("input[data-test='proposalValue2']").type(input);
      cy.get("input[data-test='title']").type(description);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to CREATE a proposal - update colateral", () => {
      cy.visit("/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();
      
      cy.get("[data-test='protocolSetKey']").should("exist").click();
      cy.get("[data-test='protocolConfigSelect']").click();
      cy.contains("Update collateral interval").click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(description2);

      cy.createProposalAddDescription(description2);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });


    it("I should be able to GIVE REASONS and CAST votes for proposals", () => {
      cy.mineEpochs(2);
      cy.visit("/proposals/");

      cy.get("[data-test='button-cast-yes']").each(($btn) => {
        cy.wrap($btn).click();
      });
      cy.get("[data-test='reason-vote-checkbox']").each(($btn) => {
        cy.wrap($btn).click();
      });
      cy.get("[data-test='reason-vote-textarea']").each(($btn, index) => {
        cy.wrap($btn).type("REASON " + index);
      });
    
      cy.get("#button-cast-submit").click();
      cy.get("[data-test='voted']").should("have.length", 1);
    });
  });
});
