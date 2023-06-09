import { defineConfig } from "cypress";
import setup from "./cypress/lib/setup";

export async function setupHardhatEvents(on, config) {
  // This is necessary to reset the hardhat environment between specs.
  config.experimentalInteractiveRunEvents = true;

  const env = await setup();

  on("task", {
    hardhat: () => ({
      url: env.url,
      chainId: env.chainId,
      accounts: env.accounts,
    }),
    "hardhat:reset": () => env.reset(),
  });
  on("before:spec", () => env.reset());
  on("after:run", () => env.close());
}

export default defineConfig({
  devServer: {
    framework: "nuxt",
    bundler: "vite",
  },
  e2e: {
    setupNodeEvents(on, config) {
      setupHardhatEvents(on, config);
    },
  },
});
