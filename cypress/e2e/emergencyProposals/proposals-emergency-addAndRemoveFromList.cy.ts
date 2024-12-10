describe("Proposals", () => {
  let proposalUrl = "";
  describe("Emergency Add and remove from list", () => {
    const input1 = "minters";
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const input3 = "0x388c818ca8b9251b393131c08a736a67ccb19297";
    const title = "Emergency Add and remove from list";
    const description = `Add ${input2} and remove ${input3} from list: ${input1}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyRemoveFromAndAddToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${input1}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='proposalValue3']").type(input3);

      cy.get("input[data-test='title']").type(title);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch
      // cy.task("mine", 10);
      cy.reload();
      cy.visit("/proposals/priority");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");

      cy.get("#technical-proposal-incoming-change").should("contain", input1);
      cy.get("#technical-proposal-incoming-change").should("contain", input2);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "priority");
    });

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
    });
  });
});
