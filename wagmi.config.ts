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
        "IRegistrar.sol/*.json",
        "IGovernanceDeployer.sol/*.json",
        "IGovernorDeployer.sol/*.json",
        "IVault.sol/*.json",
        "IVoteDeployer.sol/*.json",
        "IDualGovernor.sol/*.json",
        "IAuction.sol/*.json",
        "VOTE.sol/*.json",
        "VALUE.sol/*.json",
      ],
    }),
    actions(),
  ],
});
