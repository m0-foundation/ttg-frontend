describe("Proposals", () => {
  describe("type action: Emergency update config", () => {
    const value = "1";
    const valueName = "INFLATION_RATE";
    const description = `Add config ${valueName} = ${value}`;
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Update config").click();

      cy.contains("Emergency").should("exist").click({ force: true });
      cy.contains("Emergency Update config")
        .should("exist")
        .click({ force: true });

      cy.get("input[data-test='proposalValue']").type(valueName);
      cy.get("input[data-test='proposalValue2']").type(value);
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

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // cy.mineEpochs(2);
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch

      cy.visit("http://localhost:3000/proposals/");
      cy.reload();

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should(
        "contain",
        valueName
      );
      cy.get("#technical-proposal-incoming-change").should("contain", value);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.visit("http://localhost:3000/proposals/");
      cy.connectWallet();
      cy.wait(500);

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-cast-yes").click();
      });

      cy.get("[data-test='voted']").should("have.length", 1);
      cy.task("mine", 1);
      cy.reload();
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.connectWallet();

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.wait(500);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("contain", "executed");
    });

    it("I should be able to see lists", () => {
      cy.visit("http://localhost:3000/config/protocol");

      cy.get("table > tbody > tr").should("have.length", 1);

      const rowCells = (row) =>
        Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

      cy.get("table tbody tr").then((rows) => {
        const mapped = Cypress._.map(rows, rowCells)
          .map((row) => row.slice(0, 2))
          .sort();

        const should = [[valueName.toLowerCase(), value.toLowerCase()]].sort();

        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
