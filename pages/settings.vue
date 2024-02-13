<template>
  <form class="px-6 lg:p-0" @submit.prevent="onSubmit">
    <PageTitle class="mb-6">Settings</PageTitle>

    <div>
      <div class="mb-6">
        <div class="flex justify-between text-sm">
          <label>Network</label>
          <label>Chain Id: {{ chainId }}</label>
        </div>
        <select v-model="selectedNetworkId">
          <option v-for="chain in networks" :key="chain.name" :value="chain.id">
            {{ chain.name }}
          </option>
        </select>
      </div>

      <div v-if="isWithCustomRPC">
        <label>Custom RPC URL</label>
        <input
          v-model="customRPC"
          type="text"
          placeholder="http://..."
          data-test="settings-input-url-rpc"
        />

        <button
          class="rpc-button"
          data-test="settings-button-return-to-list"
          @click="onSwitchInput(false)"
        >
          return to list
        </button>
      </div>

      <div v-else>
        <label>RPC URL</label>

        <select v-model="selectedRPC" class="h-[42px]">
          <option v-for="rpc in rpcs" :key="rpc" :value="rpc">
            {{ rpc }}
          </option>
        </select>

        <button
          class="rpc-button"
          data-test="settings-button-custom-rpc"
          @click="onSwitchInput(true)"
        >
          Custom RPC
        </button>
      </div>

      <div class="flex justify-end">
        <MButton type="submit" data-test="settings-button-submit">
          Connect
        </MButton>
      </div>
    </div>
  </form>
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
  console.log({ newRpc });
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

<style>
.rpc-button {
  @apply underline text-grey-600 text-xs mt-2;
}
</style>
