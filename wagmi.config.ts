import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import DistributionVaultAbi from "./modules/spog/abi/DistributionVault.json";
import StandardGovernorABI from "./modules/spog/abi/StandardGovernor.json";
import EmergencyGovernorABI from "./modules/spog/abi/EmergencyGovernor.json";
import ZeroGovernorABI from "./modules/spog/abi/ZeroGovernor.json";
import PowerTokenABI from "./modules/spog/abi/PowerToken.json";
import RegistrarABI from "./modules/spog/abi/Registrar.json";
import ZeroTokenABI from "./modules/spog/abi/ZeroToken.json";

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
