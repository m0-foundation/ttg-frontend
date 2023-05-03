<template>
  <div class="bg-primary text-white">Balance: {{ data }}</div>
</template>

<script lang="ts" setup>
import { configureChains, sepolia, createClient } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { readErc20Mock } from "./lib/generated";
const { chains, provider, webSocketProvider } = configureChains(
  [sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
const data = await readErc20Mock({
  address: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
  functionName: "balanceOf",
  args: ["0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5"],
});
</script>
