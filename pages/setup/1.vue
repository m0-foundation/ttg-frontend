<template>
  <LayoutPage>
    <div>
      <div class="text-center text-xl text-grey-primary tracking-widest mb-4">
        [1/3]
      </div>
      <!-- step 1 -->
      <form @submit.prevent="onSubmit">
        <h1 class="text-center text-2xl">Connect to M&#94;ZERO network</h1>
        <p class="text-center text-grey-primary mb-8">
          Add from a list of popular networks or add a network manually. Only
          interact with the entities you trust.
        </p>
        <div>
          <div class="mb-8">
            <!-- with custom RPC -->
            <div v-if="isWithCustomRPC">
              <label class="text-grey-primary text-sm block mb-2">
                Custom RPC URL:
              </label>
              <input
                v-model="selectedRPC"
                type="text"
                placeholder="http://..."
              />

              <p class="text-grey-primary">
                <button
                  class="border-b border-white border-dashed"
                  @click="onSwitchInput(false)"
                >
                  return to list
                </button>
              </p>
            </div>

            <!-- with predefined RPC -->
            <div v-else>
              <label
                class="text-grey-primary text-sm block mb-4 flex justify-between"
              >
                Select RPC:
                <span class="text-xs border-b border-dashed">
                  Chain Id: {{ chainId }}
                </span>
              </label>

              <select v-model="selectedRPC">
                <option v-for="rpc in rpcs" :key="rpc">
                  {{ rpc }}
                </option>
              </select>

              <p class="text-grey-primary">
                or enter
                <button
                  class="border-b border-white border-dashed"
                  @click="onSwitchInput(true)"
                >
                  your Custom RPC
                </button>
              </p>
            </div>
          </div>

          <div class="flex justify-center">
            <MButton type="submit" version="secondary-dark">Connect</MButton>
          </div>
        </div>
      </form>
    </div>
  </LayoutPage>
</template>

<script setup>
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

// client
import { createClient } from "use-wagmi";

definePageMeta({
  layout: "with-only-logo",
});

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const selectedRPC = ref();
const isWithCustomRPC = ref(false);

const rpcs = config.network.rpcs.split(",");
const chainId = config.network.chainId;

async function onSubmit() {
  console.log("onSubmitStep1", { selectedRPC });
  const rpc = selectedRPC.value.toString();
  localStorage.setItem("m0:rpc", rpc);

  /* setup wagmi client */

  const { chains, provider, webSocketProvider } = configureChains(
    [sepolia], // mainnet, goerli
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: rpc,
          // webSocket: TODO?
        }),
      }),
      publicProvider(),
    ],
    { targetQuorum: 1 }
  );

  const connectors = [
    // new InjectedConnector(), // browsers that inject ethereum such as mobile app and metamask
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: "wagmi",
    //   },
    // }),
    // new WalletConnectLegacyConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
    // new LedgerConnector({
    //   chains,
    // }),
  ];

  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
    // webSocketProvider, TODO?
  });
  // install wagmi client as vue plugin using wrapper from 'use-wagmi'
  nuxtApp.vueApp.use(client);

  await navigateTo("/setup/2");
}

function onSwitchInput(version) {
  isWithCustomRPC.value = version;
  selectedRPC.value = null; // clear the input
}
</script>

<style scoped>
select,
input {
  @apply p-4 bg-transparent border border-white mb-2 block w-full;
}
</style>
