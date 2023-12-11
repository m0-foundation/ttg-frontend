describe("Proposals", () => {
  const newCashTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  describe("type action: setCashToken", () => {
    const fee = "0.001";
    const title = "Change cash token";

    let proposalUrl = "";
    let description = "";

    it("I should be able to CREATE a proposal", () => {
      // zero proposals cant be created on first epoch
      cy.mineEpochs(2);

      description = `Change cash token to ${newCashTokenAddress} with fee to ${fee}`;

      cy.visit("http://localhost:3000/proposal/create");

      cy.connectWallet();

      cy.contains("Select a proposal type").should("exist");
      cy.contains("Select a proposal type").click();

      cy.contains("Set Cash Token").click();

      cy.get("input[data-test='proposalValue']").type(newCashTokenAddress);
      cy.get("input[data-test='proposalValue2']").type(fee);

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
      cy.visit("http://localhost:3000/proposals/");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({ force: true });
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").should(
        "contain",
        newCashTokenAddress
      );
      cy.get("#technical-proposal-incoming-change").should("contain", fee);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description);
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });

    it("I should be able to check the executed proposal", () => {
      cy.visit(proposalUrl);
      cy.get("#proposal-state").should("contain", "executed");
      cy.get("#technical-proposal-current").should(
        "contain",
        newCashTokenAddress
      );
    });
  });
});