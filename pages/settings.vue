<template>
  <LayoutPage>
    <div>
      <form @submit.prevent="onSubmit">
        <h1 class="text-center text-2xl">Connect to M&#94;ZERO network</h1>
        <p class="text-center text-grey-400 mb-8">
          Add from a list of popular networks or add a network manually. Only
          interact with the entities you trust.
        </p>
        <div>
          <div class="mb-8">
            <div class="flex justify-between mb-2">
              <label>Current network:</label>
              <span class="text-xs border-b border-dashed">
                Chain Id: {{ chainId }}
              </span>
            </div>
            <select v-model="selectedNetworkId">
              <option
                v-for="chain in networks"
                :key="chain.name"
                :value="chain.id"
              >
                {{ chain.name }}
              </option>
            </select>

            <!-- with custom RPC -->
            <div v-if="isWithCustomRPC">
              <label> Custom RPC URL: </label>
              <input v-model="customRPC" type="text" placeholder="http://..." />

              <p class="text-grey-400">
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
              <label>Current RPC URL:</label>

              <select v-model="selectedRPC">
                <option v-for="rpc in rpcs" :key="rpc" :value="rpc">
                  {{ rpc }}
                </option>
              </select>

              <p class="text-grey-400">
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
import { mainnet, sepolia, hardhat } from "@wagmi/core/chains";
import { getNetworkConfig } from "@/network";

const apiStore = useApiClientStore();
const networkStore = useNetworkStore();

const networks = [mainnet, sepolia, hardhat];
const configNetwork = networkStore.getNetwork();

const isWithCustomRPC = ref(
  !configNetwork.value!.rpc.values.includes(apiStore.rpc)
);

const selectedNetworkId = ref(
  networks.find((network) => network.id === configNetwork.value.rpc.chainId)
    ?.id || mainnet.id
);

const selectedNetworkConfig = computed(() =>
  getNetworkConfig(selectedNetworkId.value)
);

const customRPC = ref(apiStore.rpc);
const selectedRPC = ref(apiStore.rpc);

const rpcs = computed(() => selectedNetworkConfig.value!.rpc.values);
const chainId = computed(() => selectedNetworkConfig.value!.rpc.chainId);

useHead({
  titleTemplate: "%s - Settings",
});

function onSubmit() {
  const newRpc = isWithCustomRPC.value ? unref(customRPC) : unref(selectedRPC);
  const newConfig = getNetworkConfig(unref(selectedNetworkId))!;

  networkStore.setNetwork(newConfig);
  apiStore.setRpc(newRpc);

  reloadNuxtApp({ path: "/settings", force: true });
}

function onSwitchInput(version: boolean) {
  isWithCustomRPC.value = version;
  customRPC.value = "";
}
</script>

<style scoped>
select,
input {
  @apply p-4 bg-transparent border border-white mb-2 block w-full;
}

label {
  @apply text-grey-400 text-sm block mb-2;
}
</style>
