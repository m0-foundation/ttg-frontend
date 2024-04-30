describe("Proposals", () => {
  let proposalUrl = "";
  const LIST = "minters";
  const add1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const add2 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  describe("Add an Address to the list: minters", () => {
    const description = `Add ${add1} to list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST}']`).click();

      cy.get("input[data-test='proposalValue2']").type(add1);
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
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.visit("/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", add1);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.mineEpochs(1);
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", add1);
    });
  });

  describe("removeFromAndAddToList", () => {
    const title = "swap addresses";
    const description = `remove From ${add1} and add ${add2} to list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='removeFromAndAddToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST}']`).click();

      cy.get("input[data-test='proposalValue2']").type(add1);
      cy.get("input[data-test='proposalValue3']").type(add2);
      cy.get("input[data-test='title']").type(title);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        cy.wrap($el).click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.mineEpochs(1);

      cy.visit("/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", add1);
      cy.get("#technical-proposal-incoming-change").should("contain", add2);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.mineEpochs(1);
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", add2);
    });

    it("I should be able to see lists", () => {
      cy.visit("/actors");

      cy.contains(add2);
    });
  });
});
