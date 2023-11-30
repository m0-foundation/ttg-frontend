import { mainnet, sepolia, hardhat } from "@wagmi/core/chains";
import { configureChains, InjectedConnector } from "@wagmi/core";
// connectors
import { CoinbaseWalletConnector } from "@wagmi/core/connectors/coinbaseWallet";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";

// RPCs providers
import { publicProvider } from "@wagmi/core/providers/public";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
// use wagmi
import { createConfig } from "use-wagmi";

export const useWagmi = (rpc: string, fallbackRpc?: string) => {
  const config = useRuntimeConfig();
  const networkStore = useNetworkStore();

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [hardhat, mainnet, sepolia],
    [
      jsonRpcProvider({
        rpc: () => ({
          http: rpc,
        }),
      }),
      // fallback
      fallbackRpc
        ? jsonRpcProvider({ rpc: () => ({ http: fallbackRpc }) })
        : publicProvider(),
    ]
  );

  const getConnectors = () => {
    const injectedConnector = new InjectedConnector({
      chains,
    });

    if (config.public.env.node === "production") {
      // need to skip the code to avoid calling wallet connect server
      const walletConnectConnector = new WalletConnectConnector({
        chains,
        options: {
          projectId: config.public.walletConnectProjectId,
        },
      });

      const coinbaseWalletConnector = new CoinbaseWalletConnector({
        chains,
        options: {
          appName: "spog",
          jsonRpcUrl: networkStore.network.rpc.default,
        },
      });

      return [
        injectedConnector,
        walletConnectConnector,
        coinbaseWalletConnector,
      ];
    } else {
      return [injectedConnector];
    }
  };

  const connectors = getConnectors();

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  // install wagmi client as vue plugin using wrapper from 'use-wagmi'
  return { client: wagmiConfig };
};
