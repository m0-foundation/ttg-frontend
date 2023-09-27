import { defineConfig } from "@wagmi/cli";
import { actions } from "@wagmi/cli/plugins";
import DualGovernorABI from "./modules/spog/abi/DualGovernor.json";
import PowerBootstrapTokenABI from "./modules/spog/abi/PowerBootstrapToken.json";
import PowerTokenABI from "./modules/spog/abi/PowerToken.json";
import RegistrarABI from "./modules/spog/abi/Registrar.json";
import ZeroTokenABI from "./modules/spog/abi/ZeroToken.json";

export default defineConfig({
  out: "lib/sdk.ts",
  contracts: [
    {
      name: "DualGovernor",
      abi: DualGovernorABI,
    },
    {
      name: "PowerBootstrapToken",
      abi: PowerBootstrapTokenABI,
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
  ],
  plugins: [actions()],
});
