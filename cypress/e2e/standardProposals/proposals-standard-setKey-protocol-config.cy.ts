describe("Proposals", () => {
  describe("type action: setProposalFee", () => {
    const input =
      "5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8";
    const description = `Add protocol guidance:${input}`;

    const input2 = "1";
    const description2 = `Add Update collateral interval:${input2}`;

    let proposalUrl = "";

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

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      cy.mineEpochs(2);

      cy.visit("/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal)
          .find("[data-test='proposal-button-show-details']")
          .click({ force: true });
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
      cy.castYesAllProposals();
      cy.get("[data-test='voted']").should("have.length", 2);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.mineEpochs(1);
      cy.executeAllProposals();
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit("/history");

      cy.get('span:contains("executed")').should("have.length", 2);
    });
  });
});
