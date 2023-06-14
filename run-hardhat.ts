import setup from "./cypress/lib/setup";
import deploy from "./cypress/lib/deploy-spog";

async function run() {
  const env = await setup();
  console.log({ env });
  await deploy(env);
}

run();
