import { Network } from "../../hardhat/setup";
import deployTtg from "../../hardhat/deploy-ttg";

export default async function redeploy() {
  cy.task("hardhat:reset");
  const network: Network = await new Promise((resolve) => {
    cy.task("hardhat").then((network) => {
      resolve(network as Network);
    });
  });
  console.log(network);
  await deployTtg(network);
}
