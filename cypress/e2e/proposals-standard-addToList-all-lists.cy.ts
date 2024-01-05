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
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='proposalValue']").select(LIST1);

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description1);

      cy.get("textarea[data-test='description']").type(description1);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal to ADD an address to a list: validators", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='proposalValue']").select(LIST2);

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description2);

      cy.get("textarea[data-test='description']").type(description2);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal to ADD an address to a list: earners", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='proposalValue']").select(LIST3);

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input1);
      cy.get("input[data-test='title']").type(description3);

      cy.get("textarea[data-test='description']").type(description3);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
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

    it("I should be able to EXECUTE the proposals", () => {
      // cy.executeOneProposal(description1);
      cy.mineEpochs(1);

      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.connectWallet();

      cy.contains("article", description1).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.wait(500);
      cy.reload();

      cy.contains("article", description2).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.wait(500);
      cy.reload();

      cy.contains("article", description3).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.wait(500);
      cy.reload();
    });

    it("I should be able to check the executed proposals", () => {
      it("I should be able to see lists", () => {
        cy.visit("http://localhost:3000/lists");

        cy.get("table > tbody > tr").should("have.length", 3);

        const rowCells = (row) =>
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
