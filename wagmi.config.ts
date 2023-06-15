import { defineConfig } from "@wagmi/cli";
import { foundry, actions } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "lib/sdk.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "contracts",
      include: [
        "I**.sol/*.json",
        "ListFactory.sol/*.json",
        "DualGovernor.sol/*.json",
      ],
    }),
    actions(),
  ],
});
