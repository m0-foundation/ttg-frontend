describe("Proposals", () => {
  it.skip("I should be able to CREATE a proposal type Power", () => {
    const LIST = "CollateralManagers";
    const input1 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Add ${input1} to list: ${LIST}`;

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Add to a list").should("exist").click({ force: true });

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
    cy.get("input[data-test='proposalValue']").type(LIST);
    // address to append
    cy.get("input[data-test='proposalValue2']").type(input1);

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

  /* TODO: investigate Reset Bug getProposal is undefined
  it("I should be able to CREATE a proposal type Zero", () => {
    const description3 =
      "Reset Governor - when executed new governor and power token are auto-deployed and the values in registrar are overwritten";

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Reset").click({ force: true });

    cy.get("input[data-test='proposalValue']").should("not.exist");

    cy.get("textarea[data-test='description']").type(description3);

    cy.contains("Preview proposal").should("exist");
    cy.contains("Preview proposal").click();

    cy.connectWallet();

    cy.contains("Submit proposal").should("exist");
    cy.contains("Submit proposal").then(($el) => {
      $el.click();
      cy.get(".complete").should("have.length", 3);
    });
  });
  */

  it("I should be able to ACCESS the ACTIVE proposal", () => {
    cy.mineEpochs(2);
    // zero holders cannot vote on first epoch
    //  cy.mineEpochs(1);
  });

  it("I should be able to CREATE a proposal type Emergency", () => {
    const input1 = "CollateralManagers";
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const description = `Emergency Add ${input2} to list ${input1}`;

    cy.visit("http://localhost:3000/proposal/create");
    cy.contains("Select a proposal type").should("exist");
    cy.contains("Select a proposal type").click();

    cy.contains("Emergency").should("exist").click({ force: true });

    cy.contains("Emergency Add to a list").should("exist");
    cy.contains("Emergency Add to a list").click({ force: true });

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
});
