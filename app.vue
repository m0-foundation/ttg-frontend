<template>
  <div class="bg-primary text-white">Balance: {{ data }}</div>
  <w3m-core-button />
</template>

<script lang="ts" setup>
import { configureChains, createClient } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { sepolia, mainnet, polygon } from "@wagmi/core/chains";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";

import { readErc20Mock } from "./lib/generated";

const chains = [sepolia, mainnet, polygon];

const config = useRuntimeConfig();
const projectId = config.WALLET_CONNECT_PROJECT_ID;

const { provider, webSocketProvider } = configureChains(
  [sepolia],
  [w3mProvider({ projectId })]
);

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
});

const ethereumClient = new EthereumClient(wagmiClient, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);

const data = await readErc20Mock({
  address: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
  functionName: "balanceOf",
  args: ["0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5"],
});
</script>
