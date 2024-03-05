describe("Proposals", () => {
  const LIST = "minters";
  let proposalUrl = "";

  describe("Append an Address to the list", () => {
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Add ${input2} to list ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyAddToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        cy.wrap($el).click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch
      // cy.task("mine", 10);
      cy.reload();
      cy.visit("/proposals/emergency");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", input2);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "emergency");
    });

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
    });
  });

  describe("Emergency Remove the Address from the list", () => {
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Emergency Remove ${input2} from list ${LIST}`;

    it("I should be able to CREATE a proposal to REMOVE an address from a list", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencyRemoveFromList']").click({ force: true });

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(description);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        cy.wrap($el).click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch
      cy.reload();
      cy.visit("/proposals/emergency");

      cy.contains(description).should("exist");

      // from active page go to proposal page
      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", input2);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal of Remove from a list", () => {
      cy.castYesOneOptionalProposal(description, "emergency");
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
