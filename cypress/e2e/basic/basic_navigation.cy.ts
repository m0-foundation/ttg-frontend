describe("Basic navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("I should visit homepage and see navigation", () => {
    cy.url().should("include", "/proposals");
    cy.checkAppNavigation();
  });

  it("I should see history page", () => {
    cy.visit("/history");

    cy.get("h1").should("have.length", 1);
    cy.get("h1").should("contain.text", "Proposals");

    cy.get("[data-test='history-table']").should("exist");
  });

  it("I should be able to connect/disconnect wallet", () => {
    cy.connectWallet();
  });
});
