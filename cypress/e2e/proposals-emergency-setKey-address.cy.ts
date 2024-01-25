describe("Proposals", () => {
  describe("type action: setKey", () => {
    const descriptions: string[] = [];
    const keys: string[] = [];
    const values: string[] = [];

    it("I should be able to CREATE a proposal - Minter rate model ", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();

      cy.get("[data-test='emergencySetKey']").click({ force: true });

      cy.contains("Update protocol config").click();

      cy.get("[data-test='protocolConfigSelect']").should("exist");
      cy.get("[data-test='protocolConfigSelect']").click();

      // config
      cy.contains("Minter rate").click();

      const value = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
      const key = "minter_rate_model";
      const description = `Add protocol config ${key} = ${value}`;
      descriptions.push(description);
      keys.push(key);
      values.push(value);

      cy.get("input[data-test='proposalValue2']").type(value);
      cy.get("input[data-test='title']").type(description);
      cy.get("textarea[data-test='description']").type(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(descriptions[0], "emergency");
    });

    it("I should be able to EXECUTE the proposal", () => {
      const execute = (description) => {
        cy.visit("http://localhost:3000/proposals/succeeded");
        cy.connectWallet();

        cy.reload();

        cy.contains("article", description).then(($proposal) => {
          cy.wrap($proposal).find("#button-proposal-execute").click();
        });

        cy.wait(500);
      };

      execute(descriptions[0]);

      cy.mineEpochs(1);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit("http://localhost:3000/config/protocol");

      cy.get("table > tbody > tr").should("have.length", descriptions.length);

      const rowCells = (row) =>
        Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

      cy.get("table tbody tr").then((rows) => {
        const mapped = Cypress._.map(rows, rowCells)
          .map((row) => row.slice(0, 2))
          .sort();

        const should = [
          [keys[0].toLowerCase(), values[0].toLowerCase()],
        ].sort();

        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
