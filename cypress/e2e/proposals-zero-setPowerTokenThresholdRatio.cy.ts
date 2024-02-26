describe("Proposals", () => {
  describe("type action: setThresholdRatio for Power Token", () => {
    const input1 = "15";
    const description = "Set Power Token Threshold Ratio to 15";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      // zero proposals cant be created on first epoch
      cy.mineEpochs(2);

      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.contains("Power threshold").click();

      cy.get("input[data-test='proposalValue']").type(input1);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      cy.wait(500);
      cy.visit("http://localhost:3000/proposals/zero");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input1);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "zero");
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-current").should("contain", input1);
    });
  });
});
