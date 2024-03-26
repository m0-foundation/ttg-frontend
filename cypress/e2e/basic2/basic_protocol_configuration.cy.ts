describe("Basic configuration", () => {
  beforeEach(() => {
    cy.visit("/config/protocol");
  });

  it("I should visit mzero protocol config page and see navigation", () => {
    cy.disconnectWallet();
    cy.url().should("include", "/config/protocol");
    cy.findByRole("button", {name: /Create proposal/i}).should("be.visible");
    cy.findByRole("button", {name: /Connect Wallet/i}).should("be.visible");

    cy.get("nav").should("contain", "Home");
    cy.get("nav").should("contain", "List");
    cy.get("nav").should("contain", "Governance Config");
    cy.get("nav").should("contain", "M0 Protocol Config");
  });

  it("I should see all configuration parameters", () => {
    cy.get('h1').should('contain', 'M^0 Protocol Configurations')

    cy.get('table').should('have.length', 1)
    cy.get('table').find('tbody tr').should('exist')

    const configParams = [
      "updateCollateral_interval",
      "updateCollateral_threshold",
      "penalty_rate",
      "mint_delay",
      "mint_ttl",
      "mint_ratio",
      "minter_freeze_time"
    ]

    // changeable parameters table
    cy.get('table').eq(0).find('tbody tr').should('have.length', configParams.length)

    configParams.forEach((value: string) => {
      cy.get('table').find('tbody tr').contains(value)
    })
  });
});
