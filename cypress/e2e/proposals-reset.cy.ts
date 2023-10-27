describe("Proposals", () => {
  describe("Emergency proposal for type action: AddToList", () => {
    let oldGovernor = "";
    let newGovernor = "";
    const description =
      "Reset Governor - when executed new governor and power token are auto-deployed and the values in registrar are overwritten";

    it("Get old Govenor", () => {
      cy.visit("http://localhost:3000/config/governance");
      cy.get("table > tbody > tr:nth-child(13) > td:nth-child(2)").then(
        ($el) => {
          oldGovernor = $el.text();
          console.log({ oldGovernor });
        }
      );
    });

    it("I should be able to CREATE a proposal to Reset", () => {
      // zero holders cannot vote on first epoch
      cy.mineEpochs(1);

      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Reset").click({ force: true });

      cy.get("input[data-test='proposalValue']").should("not.exist");

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

    it("I should be able to ACCESS the proposal", () => {
      // reset does not need to forward to next epoch, it will be able to vote on same epoch
      cy.reload();
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.visit("http://localhost:3000/proposals/");
      cy.connectWallet();
      cy.wait(500);

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-cast-yes").click();
      });
      cy.get("#button-cast-submit").click();
      cy.task("mine", 1);
      cy.reload();
    });

    it("I should be able to EXECUTE the proposal of ADD to a list", () => {
      cy.reload();
      cy.visit("http://localhost:3000/proposals/succeeded");
      cy.connectWallet();

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-proposal-execute").click();
      });

      cy.wait(500);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit("http://localhost:3000/config/governance");

      cy.get("table > tbody > tr:nth-child(13) > td:nth-child(2)").then(
        ($el) => {
          newGovernor = $el.text();
          console.log({ newGovernor, oldGovernor });
        }
      );

      expect(newGovernor).to.not.equal(oldGovernor);
    });
  });
});
