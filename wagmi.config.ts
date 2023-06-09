import { defineConfig } from "@wagmi/cli";
import { foundry, actions } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "lib/sdk.ts",
  contracts: [],
  plugins: [
    foundry({
      artifacts: "node_modules/@mzero-labs/spog/out",
      include: ["I**.sol/*.json", "ListFactory.sol/*.json"],
    }),
    actions(),
  ],
});
