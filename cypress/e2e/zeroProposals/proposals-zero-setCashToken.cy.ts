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

      cy.visit("/proposal/create");
      cy.connectWallet();

      // select cash token proposal
      cy.get("[data-test='proposalTypeSelect']").should("exist").click();
      // cy.get("[data-test='proposalTypeSelect']").findByRole('button',{name: /Cash Token/i}).click();

      cy.contains("Change cash token").click();
     
      // select cash token
      cy.get("[data-test='select-cash-token']").should('be.visible').click();
      cy.get("[data-test='Cash Token']").should('be.visible').click();
      // assert token address after selection
      cy.get("[data-test='select-cash-token']").parent().find('span.text-xxs').should('contain', '0x');

      // type fee proposal
      cy.get("input[data-test='proposalValue2']").should('be.visible')
      cy.get("input[data-test='proposalValue2']").type(fee);

      cy.get("input[data-test='title']").type(title);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });

    it("I should be able to ACCESS the ACTIVE proposal", () => {
      cy.visit("/proposals/zero");

      cy.contains(description).should("exist");

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#show-details").click({force: true});
      });

      cy.url().should("match", /proposal\/([0-9])\w+/g);
      cy.contains(".markdown-body", description).should("exist");
      cy.wait(500); // wait to load props values

      cy.get("#technical-proposal-incoming-change").parent().parent().should(
        "contain",
        newCashTokenAddress
      );
      cy.get("#technical-proposal-incoming-change").should("contain", fee);

      cy.url().then((url) => {
        proposalUrl = url;
      });
    });

    it("I should be able to CAST vote YES for the proposal", () => {
      cy.castYesOneOptionalProposal(description, "zero");
    });

    it("I should be able to EXECUTE the proposal", () => {
      cy.executeOneProposal(description);
    });
  });
});
