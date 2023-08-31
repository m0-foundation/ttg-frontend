describe("Proposals", () => {
  describe("type action: changeTaxRange", () => {
    const input1 = "2";
    const input2 = "8";
    const description = "Change Tax Range to 2-8 $CASH";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Tax").click();
      cy.contains("Change Tax range").click();

      cy.get("input[data-test='proposalValue']").type(input1);
      cy.get("input[data-test='proposalValue2']").type(input2);

      cy.get("textarea[name='description']").type(description);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to DELEGATE VOTE", () => {
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });

    it("I should be able to DELEGATE VALUE", () => {
      // delegate to self account before voting to have vote power
      cy.delegateValue();
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.task("mine", 100);

      cy.wait(500);
      cy.visit("http://localhost:3000/proposals/active");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input1);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-current").should("contain", input1);
      cy.get("#technical-proposal-current").should("contain", input2);
    });
  });
});
