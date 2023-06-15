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

export const useWagmi = (rpc: string) => {
  const config = useRuntimeConfig();

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [hardhat], // mainnet, sepolia,
    [
      jsonRpcProvider({
        rpc: () => ({
          http: rpc,
        }),
      }),
      publicProvider(), // fallback
    ]
  );

  const connectors = [
    // browsers that inject ethereum such as mobile app and metamask
    new InjectedConnector({
      chains,
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "spog",
        jsonRpcUrl: config.public.network.defaultRpc,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: config.public.walletConnectProjectId,
      },
    }),
  ];

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  // install wagmi client as vue plugin using wrapper from 'use-wagmi'
  return { client: wagmiConfig };
};
