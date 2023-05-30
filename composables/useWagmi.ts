import { mainnet, sepolia } from "@wagmi/core/chains";
import { configureChains, InjectedConnector } from "@wagmi/core";
// connectors
import { CoinbaseWalletConnector } from "use-wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "use-wagmi/connectors/ledger";
import { MetaMaskConnector } from "use-wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "use-wagmi/connectors/walletConnectLegacy";
// RPCs providers
import { publicProvider } from "@wagmi/core/providers/public";
import { jsonRpcProvider } from "@wagmi/core/providers/jsonRpc";
// use wagmi
import { createClient } from "use-wagmi";

export const useWagmi = (rpc: string, chain = sepolia) => {
  const { chains, provider, webSocketProvider } = configureChains(
    [chain], // mainnet, goerli
    [
      jsonRpcProvider({
        rpc: () => ({
          http: rpc,
          // webSocket: TODO?
        }),
      }),
      // publicProvider(),
    ],
    { targetQuorum: 1 }
  );

  const connectors = [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    // browsers that inject ethereum such as mobile app and metamask
    // new InjectedConnector(),
  ];

  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
    // webSocketProvider, TODO?
  });
  // install wagmi client as vue plugin using wrapper from 'use-wagmi'
  return { client };
};
