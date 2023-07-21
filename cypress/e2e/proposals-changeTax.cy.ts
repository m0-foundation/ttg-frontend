describe("Proposals", () => {
  describe("type action: changeTax", () => {
    const input = "1";
    const description = "Change tax to 1 $CASH";
    let proposalUrl = "";

    it("I should be able to CREATE a proposal", () => {
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

      cy.get("input[data-test='proposalValue']").type(input);

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

    it("I should be able to ACCESS the SCHEDULED proposal", () => {
      cy.visit("http://localhost:3000/proposals/scheduled");
      cy.contains(description).should("exist");
      cy.contains("td", description);
    });

    it("I should be able to DELEGATE", () => {
      cy.visit("http://localhost:3000/proposals/active");
      cy.connectWallet();
      cy.reload();
      // delegate to self account before voting to have vote power
      cy.delegateVote();
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      // forward in time to be able to vote
      cy.task("mine", 100).then((obj) => {
        console.log("mined", { obj });
      });

      cy.wait(1000);
      cy.visit("http://localhost:3000/proposals/active");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        expect($proposal.find(".active")).to.contain("active");
        expect($proposal.find("a")).to.contain("show details");
        cy.wrap($proposal).find("a").click();
      });

      cy.url().should("match", /proposals\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should("contain", input);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.visit(proposalUrl);
      cy.connectWallet();
      cy.wait(1000);

      cy.get("#vote-yes-percentage").should("contain", "0%");
      cy.get("#button-cast-yes").click();
      cy.task("mine", 5);
      cy.reload();
      cy.get("#vote-yes-percentage").should("contain", "100%");
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.visit(proposalUrl);
      cy.connectWallet();

      cy.task("mine", 100);
      cy.wait(500);
      cy.reload();

      cy.get("#proposal-state").should("contain", "succeeded");
      cy.contains("article", "Execute?").should("exist");
      cy.get("#button-proposal-execute").click();
      cy.wait(500);

      cy.task("mine", 10);
      cy.wait(500);
      cy.reload();

      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-current").should("contain", input);
    });
  });
});
