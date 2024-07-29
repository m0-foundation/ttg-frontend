it.skip("Proposals", () => {
  let proposalUrl = "";
  describe("Emergency Add and remove from list", () => {
    const list1 = "minters";
    const list2 = "validators";
    const actor1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const actor2 = "0x388c818ca8b9251b393131c08a736a67ccb19297";
    const title1 = "Emergency Add and remove from list";
    const description1 = `Add ${list1} list: ${actor1}`;
    const title2 = "Emergency Add and remove from list";
    const description2 = `Add ${list2} list: ${actor2}`;


    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyAddToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${list1}']`).click();

      cy.get("input[data-test='proposalValue2']").type(actor1);

      cy.get("input[data-test='title']").type(title1);
      cy.createProposalAddDescription(description1);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyAddToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${list2}']`).click();

      cy.get("input[data-test='proposalValue2']").type(actor2);

      cy.get("input[data-test='title']").type(title2);
      cy.createProposalAddDescription(description2);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });


    it("I should be able to CAST vote YES for the proposal", () => {

      cy.visit("/proposals/emergency");

      cy.get("[data-test='button-cast-yes']").each(($btn) => {
        cy.wrap($btn).click();
      });
    
      cy.get("#button-cast-submit").click();

      cy.wait(1000);
    });

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
      cy.executeAllProposals();
    });

   
  });
});
