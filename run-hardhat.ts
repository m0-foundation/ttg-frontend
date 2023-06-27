import setup from "./hardhat/setup";
import deploySpog from "./hardhat/deploy-spog";

async function run() {
  const env = await setup();
  console.log({ env });
  await deploySpog(env);
}

run();
