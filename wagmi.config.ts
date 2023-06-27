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
        "IERC20PricelessAuction.sol/*.json",
        "IList.sol/*.json",
        "ISPOG.sol/*.json",
        "ISPOGGovernor.sol/*.json",
        "IValueToken.sol/*.json",
        "IVault.sol/*.json",
        "IVoteToken.sol/*.json",
        "ListFactory.sol/*.json",
      ],
    }),
    actions(),
  ],
});
