
describe("Add claimant to earner test", () => {
// needs to be checkesumed
  const earner = "0xdd82875f0840AAD58a455A70B88eEd9F59ceC7c7";
  const claimant = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  describe("Create proposal to add earner to actors", () => {
    const LIST = "earners";
    const description = `Add ${earner} to list: ${LIST}`;

    it("I should be able to CREATE proposal", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${LIST}']`).click();

      cy.get("input[data-test='proposalValue2']").type(earner);
      cy.get("input[data-test='title']").type(description);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });
  });

  describe("Create proposal to add claimant to the earner", () => {
    const description2 = `Add claimant ${claimant} to earner ${earner}`;

    it("I should be able to CREATE a proposal to ADD claimant to earner", () => {
      cy.visit("/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='standardProtocolAddClaimant']").click();

      cy.get("[data-test='earners-input']").type(earner);

      cy.get("input[data-test='proposalValue2']").type(claimant);
      cy.get("input[data-test='title']").type(description2);

      cy.createProposalAddDescription(description2);

      cy.clickPreviewProposal();

      cy.clickSubmitProposal();
    });
  });

  describe("Execute proposals", () => {
    it("I should be able to see ACTIVE proposals", () => {
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.wait(500);
    });

    it("I should be able to CAST vote YES for the proposals", () => {
      cy.castYesAllProposals();
      cy.wait(1000);
    });

    it("I should be able to EXECUTE the proposals", () => {
      cy.mineEpochs(1);
      cy.visit("/proposals/succeeded");

      cy.get("[data-test='proposal-button-execute']").each(($btn) => {
        cy.wrap($btn).click();
        cy.wait(500);
      });

      cy.wait(500);
      cy.mineEpochs(1);
    });

    it('Check Claimant was added corretly', () => {
      cy.visit("/actors/smart-m/");
     
      cy.contains(claimant);
      cy.contains(earner);
    })
  })
});
