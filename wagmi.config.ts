import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import DistributionVaultAbi from "./modules/ttg/abi/DistributionVault.json";
import StandardGovernorABI from "./modules/ttg/abi/StandardGovernor.json";
import EmergencyGovernorABI from "./modules/ttg/abi/EmergencyGovernor.json";
import ZeroGovernorABI from "./modules/ttg/abi/ZeroGovernor.json";
import PowerTokenABI from "./modules/ttg/abi/PowerToken.json";
import RegistrarABI from "./modules/ttg/abi/Registrar.json";
import ZeroTokenABI from "./modules/ttg/abi/ZeroToken.json";

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
