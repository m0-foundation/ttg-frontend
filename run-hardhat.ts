import setup from "./cypress/lib/setup";
import deploySpog from "./cypress/lib/deploy-spog";

async function run() {
  const env = await setup();
  console.log({ env });
  await deploySpog(env);
}

run();
