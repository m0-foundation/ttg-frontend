import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import DistributionVaultAbi from "./modules/m-core/abi/DistributionVault.json";
import StandardGovernorABI from "./modules/m-core/abi/StandardGovernor.json";
import EmergencyGovernorABI from "./modules/m-core/abi/EmergencyGovernor.json";
import ZeroGovernorABI from "./modules/m-core/abi/ZeroGovernor.json";
import PowerTokenABI from "./modules/m-core/abi/PowerToken.json";
import RegistrarABI from "./modules/m-core/abi/Registrar.json";
import ZeroTokenABI from "./modules/m-core/abi/ZeroToken.json";

export default defineConfig({
  out: "lib/sdk.ts",
  contracts: [
    {
      name: "StandardGovernor",
      abi: StandardGovernorABI,
    },

    {
      name: "EmergencyGovernor",
      abi: EmergencyGovernorABI,
    },

    {
      name: "ZeroGovernor",
      abi: ZeroGovernorABI,
    },

    {
      name: "PowerToken",
      abi: PowerTokenABI,
    },
    {
      name: "Registrar",
      abi: RegistrarABI,
    },
    {
      name: "ZeroToken",
      abi: ZeroTokenABI,
    },
    {
      name: "DistributionVault",
      abi: DistributionVaultAbi,
    },
  ],
  plugins: [actions()],
});
