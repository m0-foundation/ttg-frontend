import { faker } from "@faker-js/faker";

describe("Proposals Lists", () => {
  const LIST1 = "CollateralManagers";
  const LIST2 = "Vendors";

  const input1 = faker.finance.ethereumAddress();
  const input2 = faker.finance.ethereumAddress();
  const input3 = faker.finance.ethereumAddress();
  const input4 = faker.finance.ethereumAddress();

  const description1 = `Add ${input1} to list: ${LIST1}`; // <= will be removed
  const description2 = `Add ${input2} to list: ${LIST1}`;
  const description3 = `Add ${input3} to list: ${LIST1}`;

  const description4 = `Add ${input2} to list: ${LIST2}`;
  const description5 = `Add ${input4} to list: ${LIST2}`; // <= will be removed

  const descriptions = [
    description1,
    description2,
    description3,
    description4,
    description5,
  ];

  const descriptionRemove1 = `Remove ${input1} from list: ${LIST1}`;
  const descriptionRemove2 = `Remove ${input4} from list: ${LIST2}`;

  const descriptionsRemove = [descriptionRemove1, descriptionRemove2];

  function createProposalAddToList(list: string, address: string) {
    const proposalUrl = "";
    const description = `Add ${address} to list: ${list}`;

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Add to a list").should("exist").click({ force: true });

    cy.get("input[data-test='proposalValue']").should(
      "have.attr",
      "type",
      "text"
    );
    cy.get("input[data-test='proposalValue2']").should(
      "have.attr",
      "type",
      "text"
    );

    // list address
    cy.get("input[data-test='proposalValue']").type(list);
    // address to append
    cy.get("input[data-test='proposalValue2']").type(address);

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

  function createProposalRemoveFromList(list: string, address: string) {
    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Remove from a list").should("exist").click({ force: true });

    cy.get("input[data-test='proposalValue']").should(
      "have.attr",
      "type",
      "text"
    );
    cy.get("input[data-test='proposalValue2']").should(
      "have.attr",
      "type",
      "text"
    );

    // list address
    cy.get("input[data-test='proposalValue']").type(list);
    // address to remove
    cy.get("input[data-test='proposalValue2']").type(address);
    cy.get("textarea[name='description']").type(
      `Remove ${address} from list: ${list}`
    );

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
    cy.visit("http://localhost:3000/proposals/active/succeeded");
    cy.connectWallet();

    cy.wait(500);

    cy.contains("article", description).then(($proposal) => {
      cy.wrap($proposal).find("#button-proposal-execute").click();
    });

    cy.wait(500);
  }

  describe("Add to lists", () => {
    it("I should be able to DELEGATE", () => {
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });

    it(`${description1}`, () => {
      createProposalAddToList(LIST1, input1);
    });

    it(`${description2}`, () => {
      createProposalAddToList(LIST1, input2);
    });

    it(`${description3}`, () => {
      createProposalAddToList(LIST1, input3);
    });

    it(`${description4}`, () => {
      createProposalAddToList(LIST2, input2);
    });

    it(`${description5}`, () => {
      createProposalAddToList(LIST2, input4);
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
          cy.wrap($proposal).find("#button-cast-yes").click();
        });
      }

      cy.get("#button-cast-submit").click();
      cy.task("mine", 1);
      cy.reload();
      cy.get("[data-test='voted']").should("have.length", descriptions.length);
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

  describe("Remove from lists", () => {
    it(`${descriptionRemove1}`, () => {
      createProposalRemoveFromList(LIST1, input1);
    });

    it(`${descriptionRemove2}`, () => {
      createProposalRemoveFromList(LIST2, input4);
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

      for (const description of descriptionsRemove) {
        cy.contains("article", description).then(($proposal) => {
          cy.wrap($proposal).find("#button-cast-yes").click();
        });
      }

      cy.get("#button-cast-submit").click();
      cy.task("mine", 1);
      cy.reload();
      cy.get("[data-test='voted']").should(
        "have.length",
        descriptionsRemove.length
      );
    });

    it("Forward to EXECUTE proposal", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.task("mine", 100);
      cy.wait(500);
      cy.reload();
    });

    it(`I should be able to EXECUTE proposal: ${descriptionRemove1}`, () => {
      executeProposal(descriptionRemove1);
    });

    it(`I should be able to EXECUTE proposal: ${descriptionRemove2}`, () => {
      executeProposal(descriptionRemove2);
    });
  });

  describe("See final Lists", () => {
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
          [LIST1.toLowerCase(), input2.toLowerCase()],
          [LIST1.toLowerCase(), input3.toLowerCase()],
          [LIST2.toLowerCase(), input2.toLowerCase()],
        ].sort();

        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
