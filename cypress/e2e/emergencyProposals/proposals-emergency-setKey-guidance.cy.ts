describe("Proposals", () => {
  describe("type action: setKey", () => {
    let proposalUrl = "";
    const key = "guidance";
    const input = "QmdkVSAV53qy2og64vrbyVNqkBhBDkBzALKDURt1Z5bxR7"; //md5 hash
    const description = `Add protocol config ${key} = ${input}`;

    it("connect first", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();
    });

    it("I should be able to CREATE a proposal - Guidance ", () => {
      cy.visit("/proposal/create");

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      // config
      cy.contains("Guidance").click();

      cy.get("input[data-test='proposalValue2']").type(input);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        cy.wrap($el).click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });



    it("I should be able to ACCESS the ACTIVE proposal", () => {
      cy.visit("/proposals/emergency");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesAllEmergencyProposals();
    });
    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
    });
  });
});
