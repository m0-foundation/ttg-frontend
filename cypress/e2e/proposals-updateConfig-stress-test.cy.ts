describe("Proposals Update Config", () => {
  const KEY1 = "INFLATION_RATE";
  const KEY2 = "IPFS";
  const KEY3 = "PROTCOL";

  const key1input1 = "2";
  const key1input2 = "3";
  const key2input1 = "someValue";
  const key2input2 = "someOtherValue";
  const key3input1 = "10000";

  const description1 = `Update config ${KEY1}: ${key1input1}`;
  const description2 = `Update config ${KEY2}: ${key2input1}`;
  const description3 = `Update config ${KEY3}: ${key3input1}`;
  const description4 = `Update config ${KEY1}: ${key1input2}`;
  const description5 = `Update config ${KEY2}: ${key2input2}`;

  const descriptions = [
    description1,
    description2,
    description3,
    description4,
    description5,
  ];

  function createProposal(valueName: string, value: any, description: string) {
    cy.visit("http://localhost:3000/proposals/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Update Config").click();

    cy.get("input[data-test='proposalValue']").type(valueName);
    cy.get("input[data-test='proposalValue2']").type(value);

    cy.get("textarea[name='description']").type(description);

    cy.contains("Preview proposal").should("exist");
    cy.contains("Preview proposal").click();

    cy.connectWallet();

    cy.contains("Submit proposal").should("exist");
    cy.contains("Submit proposal").then(($el) => {
      $el.click();
      cy.get(".complete").should("have.length", 3);
    });
  }

  function executeProposal(description: string) {
    cy.visit("http://localhost:3000/proposals/succeeded");
    cy.connectWallet();

    cy.contains("article", description).then(($proposal) => {
      expect($proposal.find("a")).to.contain("show details");
      cy.wrap($proposal).find("a").click();
    });

    cy.get("#proposal-state").should("contain", "succeeded");
    cy.contains("article", "Execute?").should("exist");
    cy.get("#button-proposal-execute").click();
    // cy.wait(500);

    cy.task("mine", 1);
    cy.wait(500);
    cy.reload();

    cy.get("#proposal-state").should("contain", "executed");
  }

  before(() => {
    it("I should be able to DELEGATE", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.connectWallet();
      cy.reload();
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });
  });

  describe("Add to lists", () => {
    it("I should be able to DELEGATE", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.connectWallet();
      cy.reload();
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });

    it(`${description1}`, () => {
      createProposal(KEY1, key1input1, description1);
    });

    it(`${description2}`, () => {
      createProposal(KEY2, key2input1, description2);
    });

    it(`${description3}`, () => {
      createProposal(KEY3, key3input1, description3);
    });

    it(`${description4}`, () => {
      createProposal(KEY1, key1input2, description4);
    });

    it(`${description5}`, () => {
      createProposal(KEY2, key2input2, description5);
    });

    it("Forward to ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.visit("http://localhost:3000/proposals/active");
      cy.task("mine", 100);
      cy.wait(1000);
    });

    it("I should be able to SELECT YES for proposals", () => {
      cy.visit("http://localhost:3000/proposals/active");

      cy.connectWallet();

      for (const description of descriptions) {
        cy.contains("article", description).then(($proposal) => {
          expect($proposal.find(".active")).to.contain("active");
          cy.wrap($proposal).find("#button-cast-yes").click();
        });
      }

      cy.get("#button-cast-submit").click();
      cy.task("mine", 1);
      cy.reload();
      cy.get(".voted").should("have.length", descriptions.length);
    });

    it("Forward to EXECUTE proposal", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.task("mine", 100);
      cy.wait(500);
      cy.reload();
    });

    it(`I should be able to EXECUTE proposal: ${description1}`, () => {
      executeProposal(description1);
    });

    it(`I should be able to EXECUTE proposal: ${description2}`, () => {
      executeProposal(description2);
    });

    it(`I should be able to EXECUTE proposal: ${description3}`, () => {
      executeProposal(description3);
    });

    it(`I should be able to EXECUTE proposal: ${description4}`, () => {
      executeProposal(description4);
    });

    it(`I should be able to EXECUTE proposal: ${description5}`, () => {
      executeProposal(description5);
    });
  });

  describe("See final Lists", () => {
    it("I should be able to see lists", () => {
      cy.visit("http://localhost:3000/config/protocol");

      cy.get("table > tbody > tr").should("have.length", 3);

      const rowCells = (row) =>
        Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

      cy.get("table tbody tr").then((rows) => {
        const mapped = Cypress._.map(rows, rowCells)
          .map((row) => row.slice(0, 2))
          .sort();

        const should = [
          [KEY1.toLowerCase(), key1input2.toLowerCase()],
          [KEY2.toLowerCase(), key1input2.toLowerCase()],
          [KEY3.toLowerCase(), key3input1.toLowerCase()],
        ].sort();

        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
