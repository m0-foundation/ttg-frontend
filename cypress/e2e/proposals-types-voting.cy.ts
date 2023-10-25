describe("Proposals", () => {
  it("I should be able to CREATE a proposal type Power", () => {
    const input = "0.001";
    const description = "Change Proposal Fee to 0.001 $CASH";

    cy.visit("http://localhost:3000/proposal/create");

    cy.connectWallet();

    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Fee").click();
    cy.contains("Change fee").click();

    cy.get("input[data-test='proposalValue']").should(
      "have.attr",
      "type",
      "number"
    );

    cy.get("input[data-test='proposalValue']").type(input);

    cy.get("div[data-test='description']").type(description);

    cy.contains("Preview proposal").should("exist");
    cy.contains("Preview proposal").click();

    cy.contains("Submit proposal").should("exist");
    cy.contains("Submit proposal").then(($el) => {
      $el.click();
      cy.get(".complete").should("have.length", 3);
    });
  });

  it("I should be able to CREATE a proposal type Double", () => {
    const newFee = "0.002";
    const minFee = "0.001";
    const maxFee = "0.008";
    const description2 = `Set proposal fee range to ${minFee}-${maxFee} and new fee = ${newFee} $CASH`;

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Fee").click();
    cy.contains("Change fee range").click();

    cy.get("input[data-test='proposalValue']").type(minFee);
    cy.get("input[data-test='proposalValue2']").type(maxFee);
    cy.get("input[data-test='proposalValue3']").type(newFee);

    cy.get("div[data-test='description']").type(description2);

    cy.contains("Preview proposal").should("exist");
    cy.contains("Preview proposal").click();

    cy.connectWallet();

    cy.contains("Submit proposal").should("exist");
    cy.contains("Submit proposal").then(($el) => {
      $el.click();
      cy.get(".complete").should("have.length", 3);
    });
  });

  it("I should be able to CREATE a proposal type Zero", () => {
    const description3 =
      "Reset Governor - when executed new governor and power token are auto-deployed and the values in registrar are overwritten";

    // zero holders cannot vote on first epoch
    cy.mineEpochs(1);

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Reset").click({ force: true });

    cy.get("input[data-test='proposalValue']").should("not.exist");

    cy.get("div[data-test='description']").type(description3);

    cy.contains("Preview proposal").should("exist");
    cy.contains("Preview proposal").click();

    cy.connectWallet();

    cy.contains("Submit proposal").should("exist");
    cy.contains("Submit proposal").then(($el) => {
      $el.click();
      cy.get(".complete").should("have.length", 3);
    });
  });

  it("I should be able to ACCESS the ACTIVE proposal", () => {
    cy.mineEpochs(1);
  });
});
