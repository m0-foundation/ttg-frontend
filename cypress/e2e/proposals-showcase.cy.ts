describe("Proposals", () => {
  describe("Create showcase proposals", () => {
    const input1 = "minters";
    const input2 = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const titleEmergency = "Emergency proposal";
    const titlePending = "Pending proposal";
    const titleStandard = "Standard proposal";
    const titleReset = "Zero proposal";
    const titleExecutable = "Executable proposal";
    const description = "test proposal description";

    it("CREATE Standard proposal add to list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${input1}']`).click();

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(titleStandard);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("MINE Epochs", () => {
      // forward in time to be able to vote
      cy.mineEpochs(2);

      cy.wait(500);
    });

    it("CREATE Zero proposal reset", () => {
      // zero proposals cant be created on first epoch

      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuReset']").click();
      cy.get("[data-test='resetToPowerHolders']").click();

      cy.get("input[data-test='proposalValue']").should("not.exist");

      cy.get("input[data-test='title']").type(titleReset);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("CREATE Standard proposal to show in pending proposals", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='addToList']").click();

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${input1}']`).click();

      // address to append
      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(titlePending);

      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("CREATE Emergency proposal add to list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyAddToList']").click({ force: true });

      cy.get("[data-test='listSelect']").click();
      cy.get(`[data-test='list_${input1}']`).click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(titleExecutable);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });

    it("VOTE YES to proposal to be executable", () => {
      cy.visit("http://localhost:3000/proposals/emergency");
      cy.connectWallet();
      cy.wait(500);

      cy.contains("article", description).then(($proposal) => {
        cy.wrap($proposal).find("#button-cast-yes").click();
      });

      cy.reload();
    });

    it("CREATE Emergency proposal add to list", () => {
      cy.visit("http://localhost:3000/proposal/create");
      cy.connectWallet();

      cy.get("[data-test='proposalTypeSelect']").should("exist").click();

      cy.get("[data-test='menuEmergency']").click();
      cy.get("[data-test='emergencyAddToList']").click({ force: true });

      cy.get("[data-test='listSelect']").click();
      cy.get("[data-test='list_validators']").click();

      cy.get("input[data-test='proposalValue2']").type(input2);
      cy.get("input[data-test='title']").type(titleEmergency);
      cy.createProposalAddDescription(description);

      cy.clickPreviewProposal();

      cy.contains("Submit proposal").should("exist");
      cy.contains("Submit proposal").then(($el) => {
        $el.click();
        cy.get(".complete").invoke("text").should("contain", "Confirmation");
      });
    });
  });
});
