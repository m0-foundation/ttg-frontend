describe("Proposals", () => {
  const proposalUrl = "";
  const LIST1 = "minters";
  const LIST2 = "validators";
  const LIST3 = "earners";

  describe("Add an Address to the list: all", () => {
    const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description1 = `Add ${input1} to list: ${LIST1}`;
    const description2 = `Add ${input1} to list: ${LIST2}`;
    const description3 = `Add ${input1} to list: ${LIST3}`;

    it("I should be able to CREATE a proposal to ADD an address to a list: minters", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST1}']`).click();

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description1);

      cy.createProposalAddDescription(description1);

      cy.clickPreviewProposal();
      cy.clickSubmitProposal();
    });

    it("I should be able to CREATE a proposal to ADD an address to a list: validators", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST2}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description2);

      cy.createProposalAddDescription(description2);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to CREATE a proposal to ADD an address to a list: earners", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST3}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description3);

      cy.createProposalAddDescription(description3);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to  ACTIVE proposals", () => {
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.wait(500);
    });

    it("I should be able to CAST vote YES for the proposal of Append to a list", () => {
      cy.castYesAllProposals();
      cy.wait(1000);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.mineEpochs(1);
      cy.visit("/proposals/succeeded");

      cy.get("[data-test='proposal-button-execute']").each(($btn) => {
        cy.wrap($btn).click();
        cy.wait(500);
      });

      cy.wait(500);
      cy.mineEpochs(1);
    });

    it("I should be able to check the executed proposals", () => {
      it("I should be able to see lists", () => {
        cy.visit("/lists");

        cy.get("table > tbody > tr").should("have.length", 3);

        const rowCells = (row: { children: any }) =>
          Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

        cy.get("table tbody tr").then((rows) => {
          const mapped = Cypress._.map(rows, rowCells)
            .map((row) => row.slice(0, 2))
            .sort();

          const should = [
            [LIST1.toLowerCase(), input1.toLowerCase()],
            [LIST2.toLowerCase(), input1.toLowerCase()],
            [LIST3.toLowerCase(), input1.toLowerCase()],
          ].sort();

          expect(mapped).to.deep.equal(should);
        });
      });
    });
  });
});
