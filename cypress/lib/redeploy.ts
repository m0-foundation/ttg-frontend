import { Network } from "./setup";
import deploySpog from "./deploy-spog";

export default async function redeploy() {
  cy.task("hardhat:reset");
  const network: Network = await new Promise((resolve) => {
    cy.task("hardhat").then((network) => {
      resolve(network as Network);
    });
  });
  console.log(network);
  await deploySpog(network);
}
