import { fallback, http } from "@wagmi/core";
import { mainnet, sepolia, hardhat } from "@wagmi/core/chains";
// connectors
import { injected, walletConnect, coinbaseWallet } from "@wagmi/connectors";

// use wagmi
import { createConfig } from "use-wagmi";

export const useWagmi = (rpc: string, fallbackRpc?: string) => {
  const config = useRuntimeConfig();

  return createConfig({
    chains: [hardhat, mainnet, sepolia],
    connectors:
      config.public.env.node === "production"
        ? [
            injected({ target: "metaMask" }),
            walletConnect({ projectId: config.public.walletConnectProjectId }),
            coinbaseWallet({ appName: "spog" }),
          ]
        : [
            injected({
              target: {
                id: "windowProvider",
                name: "Window Provider",
                provider: window.ethereum,
              },
            }),
          ],
    transports: {
      [mainnet.id]: fallback([http(rpc), http(fallbackRpc)]),
      [sepolia.id]: fallback([http(rpc), http(fallbackRpc)]),
      [hardhat.id]: http(rpc),
    },
  });
};
