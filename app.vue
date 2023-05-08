<template>
  <div>
    <Head>
      <Title>M^ZER0 | Governance</Title>
      <Meta charset="utf-8"></Meta>
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
      <Meta content="/open-graph.jpg" property="og:image" />
      <Meta content="/favicon.jpg" property="twitter:image" />

      <Link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <Link href="/favicon.jpg" rel="apple-touch-icon" />
    </Head>
    <LayoutHeader />
    <!-- out content -->
    <div class="mx-auto w-full md:w-3/4 xl:w-1/2">
      <!-- innter content -->
      <LayoutNavbar />

      <NuxtPage />
    </div>
    <LayoutFooter />
  </div>
</template>

<script lang="ts" setup>
import {
  configureChains,
  createClient as createClientWagmi,
} from "@wagmi/core";

// chains
import { mainnet, goerli, sepolia } from "@wagmi/core/chains";
// connectors
import { CoinbaseWalletConnector } from "use-wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "use-wagmi/connectors/ledger";
import { MetaMaskConnector } from "use-wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "use-wagmi/connectors/walletConnectLegacy";
// RPCs providers
import { publicProvider } from "@wagmi/core/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from "@wagmi/core/providers/infura";

import { createClient } from "use-wagmi";

const config = useRuntimeConfig();

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, sepolia],
  [
    // alchemyProvider({ apiKey: config.ALCHEMY_API_KEY! }), => alchemy does not support sepolia
    infuraProvider({ apiKey: config.INFURA_API_KEY! }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new LedgerConnector({
      chains,
    }),
  ],
  provider,
  webSocketProvider,
});

const nuxtApp = useNuxtApp();
nuxtApp.vueApp.use(client);

const wagmiCoreClient = createClientWagmi({
  autoConnect: true,
  provider,
  webSocketProvider,
});

nuxtApp.provide("wagmiCore", wagmiCoreClient);
</script>
