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
    cy.get("nav").should("contain", "Actors");
    cy.get("nav").should("contain", "Configs");
    cy.get("nav").should("contain", "Rewards");
  });

  it("I should see all configuration parameters", () => {
    cy.get('h1').should('contain', 'Configs')
    cy.get('a.link-tab').contains('Protocol').should('have.class', 'active-link-tab')
    cy.get('a.link-tab').contains('Governance').should('be.visible')

    const configParams = [
      "Update Collateral Interval",
      "Update Collateral Threshold",
      "Penalty Rate",
      "Mint Delay",
      "Mint TTL",
      "Mint Ratio",
      "Minter Freeze Time",
      "Base Minter rate",
      "Max. Earner rate",
      "Guidance",
    ]

    cy.get('h3.text-xl').should('have.length', configParams.length)

    configParams.forEach((value: string) => {
      cy.get('h3.text-xl').contains(value)
    })
  });
});
