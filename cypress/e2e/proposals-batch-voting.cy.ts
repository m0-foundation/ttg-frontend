describe("Proposals", () => {
  describe("Batching Voting for mutiple proposals", () => {
    const input1 = "15";
    const description1 = "Change update Vote Quorum Numerator to 15";
    const input2 = "1";
    const description2 = "Change tax to 1 $CASH";

    it("I should be able to DELEGATE VOTE", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.connectWallet();
      cy.reload();
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });

    it("I should be able to DELEGATE VALUE", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.connectWallet();
      cy.reload();
      // delegate to self account before voting to have vote power
      cy.delegateValue();
    });

    it("I should be able to CREATE a proposal type updateVoteQuorumNumerator", () => {
      cy.visit("http://localhost:3000/proposals/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Quorums").should("exist");
      cy.contains("Quorums").click();

      cy.contains("Vote Quorum").should("exist");
      cy.contains("Vote Quorum").click();

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "number"
      );

      cy.get("input[data-test='proposalValue']").type(input1);

      cy.get("textarea[name='description']").type(description1);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to CREATE a proposal type changeTax", () => {
      cy.visit("http://localhost:3000/proposals/create");
      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Tax").click();
      cy.contains("Change Tax").click();

      cy.get("input[data-test='proposalValue']").should(
        "have.attr",
        "type",
        "number"
      );

      cy.get("input[data-test='proposalValue']").type(input2);

      cy.get("textarea[name='description']").type(description2);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.connectWallet();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("Forward to ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.visit("http://localhost:3000/proposals/active");
      cy.task("mine", 100);
      cy.wait(1000);
    });

    it("I should be able to SELECT YES or NO for proposals", () => {
      cy.visit("http://localhost:3000/proposals/active");

      cy.connectWallet();

      cy.contains("article", description1).then(($proposal) => {
        expect($proposal.find(".active")).to.contain("active");
        cy.wrap($proposal).find("#button-cast-yes").click();
      });

      cy.contains("article", description2).then(($proposal) => {
        expect($proposal.find(".active")).to.contain("active");
        cy.wrap($proposal).find("#button-cast-no").click();
      });

      cy.get("#button-cast-submit").click();
      cy.task("mine", 1);
      cy.reload();
      cy.get(".voted").should("have.length", 2);
    });
  });
});
