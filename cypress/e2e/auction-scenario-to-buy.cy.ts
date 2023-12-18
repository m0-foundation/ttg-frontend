describe("Auction", () => {
  describe("Create Sceneario to buy in Auction", () => {
    const input = "0.001";
    const title = "Change Proposal Fee";
    const description =
      "Change Proposal Fee to 0.001 $CASH. Auction Scenario to buy.";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
      cy.mineEpochs(2);
      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Fee").click();
      cy.contains("Change fee").click();

      cy.get("input[data-test='proposalValue']").type(input);

      cy.get("input[data-test='title']").type(title);

      cy.get("textarea[data-test='description']").type(description);

      cy.contains("Preview proposal").should("exist");
      cy.contains("Preview proposal").click();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").should("have.length", 3);
      });
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      // FIRST epoch is Voting type but recenlty created non-emergency proposals can only be voted
      // in the next Voting type epoch, thus must skip 1 epoch of Transfer only until the next epoch of Voting
      cy.mineEpochs(2);

      cy.wait(100);
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneProposal(description);
    });

    it("I should be able to see power tokens available on auction", () => {
      cy.mineEpochs(1);
      cy.wait(100);
      cy.visit("http://localhost:3000/auction/");
    });
  });
});
