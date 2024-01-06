const LIST = "CollateralManagers";

describe("Proposals", () => {
  let proposalUrl = "";

  describe("Add an Address to the list", () => {
    const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Add ${input1} to list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to other list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get("[data-test='list_custom']").click();

      cy.get("input[data-test='proposalValue']").type(LIST);
      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description);

      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.wait(500);
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", input1);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal of Append to a list", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", input1);
    });
  });

  describe("Remove the Address from the other list", () => {
    const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Remove address ${input1} from list: ${LIST}`;

    it("I should be able to CREATE a proposal to REMOVE an address to a list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='removeFromList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get("[data-test='list_custom']").click();

      cy.get("input[data-test='proposalValue']").type(LIST);
      // address to remove
      cy.get("input[data-test='proposalValue2']").type(input1);

      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.mineEpochs(1);

      cy.wait(500);
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      // from active page go to proposal page
      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", LIST);
      cy.get("#technical-proposal-incoming-change").should("contain", input1);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal of Remove from a list", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", input1);
    });
  });
});
