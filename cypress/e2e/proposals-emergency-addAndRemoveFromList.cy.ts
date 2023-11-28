describe("Proposals", () => {
  let proposalUrl = "";
  describe("Emergency Add and remove from list", () => {
    const input1 = "CollateralManagers";
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const input3 = "0x388c818ca8b9251b393131c08a736a67ccb19297";
    const title = "Emergency Add and remove from list";
    const description = `Add ${input2} and remove ${input3} from list: ${input1}`;

    it("I should be able to CREATE a proposal to ADD an address to a list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Emergency").click({ force: true });
      cy.contains("Emergency Remove from and Add to list").click({
        force: true,
      });

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
      cy.get("input[data-test='proposalValue']").type(input1);
      // address to append
      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='proposalValue3']").type(input3);

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

    it("I should be able to ACCESS the EMERGENCY proposal", () => {
      // emergency does not need to forward to next epoch, it will be able to vote on same epoch
      // cy.task("mine", 10);
      cy.reload();
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input1);
      cy.get("#technical-proposal-incoming-change").should("contain", input2);

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

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
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
  });
});
