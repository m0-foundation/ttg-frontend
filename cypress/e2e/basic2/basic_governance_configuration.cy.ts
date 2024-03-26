describe("Basic configuration", () => {
  beforeEach(() => {
    cy.visit("/config/governance");
  });

  it("I should visit governance config page and see navigation", () => {
    cy.disconnectWallet();
    cy.url().should("include", "/config/governance");
    cy.findByRole("button", {name: /Create proposal/i}).should("be.visible");
    cy.findByRole("button", {name: /Connect Wallet/i}).should("be.visible");

    cy.get("nav").should("contain", "Home");
    cy.get("nav").should("contain", "List");
    cy.get("nav").should("contain", "Governance Config");
    cy.get("nav").should("contain", "M0 Protocol Config");
  });

  it("I should see all configuration parameters", () => {
    cy.get('h1').should('contain', 'Governance Config')
    cy.get('h2').should('contain', 'Changeable parameters')
    cy.get('h2').should('contain', 'Non-changeable parameters')

    cy.get('table').should('have.length', 2)
    cy.get('table').find('tbody tr').should('exist')


    // changeable parameters table
    cy.get('table').eq(0).find('tbody tr').should('have.length', 4)

    const changeableConfigParams = [
      "emergencyProposalThresholdRatio",
      "zeroProposalThresholdRatio",
      "proposalFee",
      "cashToken"
    ]

    changeableConfigParams.forEach((value: string) => {
      cy.get('table').eq(0).find('tbody tr').contains(value)
    })

    // non-changeable parameters table
    cy.get('table').eq(1).find('tbody tr').should('have.length', 6)

    const nonChangeableConfigParams = [
      "standardGovernor",
      "emergencyGovernor",
      "powerToken",
      "zeroGovernor",
      "zeroToken",
      "vault"
    ]

    nonChangeableConfigParams.forEach((value: string) => {
      cy.get('table').eq(1).find('tbody tr').contains(value)
    })
  });
});
