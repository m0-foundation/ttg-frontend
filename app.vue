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

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
// chains
import { mainnet, goerli, sepolia } from "@wagmi/core/chains";
import { configureChains } from "@wagmi/core";
// connectors
import { CoinbaseWalletConnector } from "use-wagmi/connectors/coinbaseWallet";
import { LedgerConnector } from "use-wagmi/connectors/ledger";
import { MetaMaskConnector } from "use-wagmi/connectors/metaMask";
import { WalletConnectLegacyConnector } from "use-wagmi/connectors/walletConnectLegacy";
// RPCs providers
import { publicProvider } from "@wagmi/core/providers/public";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { infuraProvider } from "@wagmi/core/providers/infura";
// client
import { createClient } from "use-wagmi";

import { SPOG, ConfigVars } from "@/lib/sdk";

const config = useRuntimeConfig();

const { chains, provider, webSocketProvider } = configureChains(
  [sepolia], // mainnet, goerli
  [
    // alchemyProvider({ apiKey: config.ALCHEMY_API_KEY! }),
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

const configVars = <ConfigVars>config.contracts;
const spogClient = new SPOG(config.ALCHEMY_URL, sepolia, configVars);
nuxtApp.provide("spogClient", spogClient);
</script>
