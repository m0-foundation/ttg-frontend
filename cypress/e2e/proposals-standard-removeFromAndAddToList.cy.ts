describe("Proposals", () => {
  let proposalUrl = "";
  const LIST = "minters";
  const add1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const add2 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  describe("Add an Address to the list: minters", () => {
    const description = `Add ${add1} to list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist");
      cy.get("[data-test='proposalTypeSelect']").click();

      cy.contains("Add address").should("exist").click({ force: true });

      cy.get("[data-test='proposalValue']").select(LIST);

      // address to append
      cy.get("input[data-test='proposalValue2']").type(add1);
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
      cy.get("#technical-proposal-incoming-change").should("contain", add1);

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
      cy.get("#technical-proposal-incoming-change").should("contain", add1);
    });
  });

  describe("removeFromAndAddToList", () => {
    const title = "swap addresses";
    const description = `remove From ${add1} and add ${add2} to list: ${LIST}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist");
      cy.get("[data-test='proposalTypeSelect']").click();

      cy.contains("Update address").click({ force: true });

      // list address
      cy.get("[data-test='proposalValue']").select(LIST);
      // address to append
      cy.get("input[data-test='proposalValue2']").type(add1);
      cy.get("input[data-test='proposalValue3']").type(add2);
      cy.get("input[data-test='title']").type(title);

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

    it("I should be able to CAST vote YES for the proposal of Append to a list", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("[data-test='executed-badge']").should("exist");
      cy.get("#technical-proposal-incoming-change").should("contain", add2);
    });

    it("I should be able to see lists", () => {
      cy.visit("http://localhost:3000/lists");

      cy.get("table > tbody > tr").should("have.length", 1);

      const rowCells = (row) =>
        Cypress._.map(row.children, (cell) => cell.innerText.toLowerCase());

      cy.get("table tbody tr").then((rows) => {
        const mapped = Cypress._.map(rows, rowCells)
          .map((row) => row.slice(0, 2))
          .sort();

        const should = [[add2.toLowerCase(), LIST.toLowerCase()]];
        console.log({ mapped, should });
        expect(mapped).to.deep.equal(should);
      });
    });
  });
});
