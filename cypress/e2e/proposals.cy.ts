before(() => {
  console.log("before all setup");
});

after(() => {
  console.log("after all teardown");
});

describe("template spec", async () => {
  it("passes", () => {
    cy.task("hardhat").then((network) => {
      console.log("network", network);
      cy.visit("http://localhost:3000/");
    });
  });
});
