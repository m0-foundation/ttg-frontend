describe("Governance", async () => {
  it("should be able to create a proposal to add a list", () => {
    cy.task("hardhat").then((network) => {
      cy.visit("http://localhost:3000/");
      cy.get("button").click();
      cy.get("div#modal-backdrop").within(() => {
        cy.get("button").eq(1).click();
      });
    });
  });
});
