describe("template spec", async () => {
  it("passes", () => {
    cy.task("hardhat").then((network) => {
      console.log(network);
      cy.visit("http://localhost:3000/");
    });
  });
});
