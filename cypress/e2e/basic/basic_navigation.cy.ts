describe("Basic navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("I should visit homepage and see navigation", () => {
    cy.url().should("include", "/proposals");
    cy.findByRole("button", {name: /Create proposal/i}).should("be.visible");

    cy.get("nav").should("contain", "Home");
    cy.get("nav").should("contain", "Actors");
    cy.get("nav").should("contain", "Configs");
    cy.get("nav").should("contain", "Rewards");
  });

  it("I should see all proposals page", () => {
    cy.findByRole("button", {name: /All proposals/i}).click();
    cy.url().should("include", "/proposals/all");

    cy.get("h1").should("have.length", 1);
    cy.get("h1").should("contain.text", "All proposals");

    cy.get("table.w-full").find("tbody tr").should("exist");
  });

  it("I should be able to connect/disconnect wallet", () => {
    // expect to be connected initially
    cy.visit("/");
    cy.findByRole("button", {name: /Create proposal/i}).should("be.visible");
    cy.findByRole("button", {name: /Connect wallet/i}).should("not.exist");
    cy.get('[data-test="sidebar-button-disconnect"]').should("exist").and("be.visible");

    // disconnect
    cy.disconnectWallet();
    cy.findByRole("button", {name: /Create proposal/i}).should("be.visible");
    cy.findByRole("button", {name: /Connect wallet/i}).should("be.visible");
    cy.findByRole("button", {name: /Disconnect wallet/i}).should("not.exist");
  })
});
