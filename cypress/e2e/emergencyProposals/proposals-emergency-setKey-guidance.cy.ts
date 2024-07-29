describe("Proposals", () => {
  describe("type action: setKey", () => {
    let proposalUrl = "";
   
    const input = "5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8"; //sha256


    function createProposal(key:string, input:string){
      cy.visit("/proposal/create");

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencyGuidanceSetKey']").click({ force: true });

      // cy.contains("Update protocol guidance").click();

      cy.get("[data-test='guidance-types-select']").should("exist");
      cy.get("[data-test='guidance-types-select']").click();

      // config
      cy.contains(key).click();
      const description = `Add protocol guidance ${key} = ${input}`;
      cy.get("input[data-test='proposalValue2']").type(input);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    }

    it("connect first", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();
    });


    it("I should be able to CREATE a proposal - Adopted Guidance ", () => {
      createProposal("Adopted guidance", input);
    });

    it("I should be able to CREATE a proposal - Ecosystem Guidance ", () => {
      createProposal("Ecosystem guidance", input);
    });

    it("I should be able to CREATE a proposal - collateral_guidance ", () => {
      createProposal("Collateral guidance", input);
    });

    it("I should be able to CREATE a proposal - spv_operators_guidance ", () => {
      createProposal("SPV operators guidance", input);
    });

    it("I should be able to CREATE a proposal - validators_guidance ", () => {
      createProposal("Validators guidance", input);
    });

    it("I should be able to CREATE a proposal - minters_guidance ", () => {
      createProposal("Minters guidance", input);
    });

    it("I should be able to CREATE a proposal - mandatory_contract_guidance ", () => {
      createProposal("Mandatory contract guidance", input);
    });

  

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesAllEmergencyProposals();
    });
    it("I should be able to EXECUTE the proposal", () => {
      cy.executeAllProposals();
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit('/proposals/all');

      cy.get('span:contains("executed")').should('have.length', 7);
    });
  });
});
