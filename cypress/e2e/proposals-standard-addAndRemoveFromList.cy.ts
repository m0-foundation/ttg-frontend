describe("Proposals", () => {
  let proposalUrl = "";

  describe("removeFromAndAddToList", () => {
    const LIST = "CollateralManagers";
    const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const input2 = "0x388c818ca8b9251b393131c08a736a67ccb19297";
    const title = "Add and remove from list";
    const description = `Add ${input1} and remove ${input2} from list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Remove from and Add to list").click({ force: true });

      // list address
      cy.get("input[data-test='proposalValue']").type(LIST);
      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='proposalValue3']").type(input2);
      cy.get("input[data-test='title']").type(title);

      cy.get("textarea[data-test='description']").type(description);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

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
      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-incoming-change").should("contain", input1);
    });
  });
});
