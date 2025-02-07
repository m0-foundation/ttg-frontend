describe("Basic configuration", () => {
  beforeEach(() => {
    cy.visit("/config/protocol");
  });

  it("I should visit mzero protocol config page and see navigation", () => {
    cy.url().should("include", "/config/protocol");

    cy.checkAppNavigation();
  });

  it("I should see all configuration parameters", () => {
    cy.get('h1').should('contain', 'Configs')

    cy.get('nav').contains('Governance')
    .and('have.attr', 'href', '/config/governance')

  cy.get('nav').contains('Protocol')
    .and('have.attr', 'href', '/config/protocol')

    const configParams = [
      "Update Collateral Interval",
      "Update Collateral Threshold",
      "Penalty Rate",
      "Mint Delay",
      "Mint TTL",
      "Mint Ratio",
      "Minter Freeze Time",
      "Base Minter Rate",
      "Max Earner Rate",
    ]

    cy.get('h3.text-xl').should('have.length', configParams.length)

    configParams.forEach((value: string) => {
      cy.get('h3.text-xl').contains(value)
    })
  });

  it("I should see all guidance configuration parameters", () => {
    cy.visit("/config/guidance");
    cy.url().should("include", "/config/guidance");
    cy.get('h1').should('contain', 'Configs')

    cy.get('nav').contains('Guidance')
    .and('have.attr', 'href', '/config/guidance')

    const configParams = [
      "Guidance",
    ]

    cy.get('h3.text-xl').should('have.length', configParams.length)

    configParams.forEach((value: string) => {
      cy.get('h3.text-xl').contains(value)
    })
  });
});
