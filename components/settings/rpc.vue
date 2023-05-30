<template>
  <LayoutPage>
    <div>
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

<script setup lang="ts">
import { mainnet, sepolia } from "@wagmi/core/chains";
import { SPOG, ConfigVars } from "@/lib/sdk";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

const selectedRPC = ref();
const isWithCustomRPC = ref(false);

const rpcs = config.network.rpcs.split(",");
const chainId = config.network.chainId;

async function onSubmit() {
  console.log({ selectedRPC });
  const newRpc = selectedRPC.value.toString();
  const rpc = useLocalStorage("m0.rpc", newRpc);

  const { client: wagmiClient } = useEthereum(rpc.value); // TODO? support mainnet
  nuxtApp.vueApp.use(wagmiClient);
  nuxtApp.provide("wagmiClient", wagmiClient);

  // * setup spog client */
  const configVars = config.contracts as ConfigVars;
  const spogClient = new SPOG(rpc.value, sepolia, configVars);
  nuxtApp.provide("spogClient", spogClient);
}

function onSwitchInput(version: boolean) {
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
