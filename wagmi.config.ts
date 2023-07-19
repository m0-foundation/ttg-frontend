import { defineConfig } from "@wagmi/cli";
import { foundry, actions } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "lib/sdk.ts",
  contracts: [],
  plugins: [
    foundry({
      project: "contracts",
      include: [
        "IERC20.sol/*.json",
        "IVoteAuction.sol/*.json",
        "ISPOG.sol/*.json",
        "ISPOGGovernor.sol/*.json",
        "ISPOGVault.sol/*.json",
        "VALUE.sol/*.json",
        "VOTE.sol/*.json",
      ],
    }),
    actions(),
  ],
});
