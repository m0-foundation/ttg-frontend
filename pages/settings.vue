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
const config = useRuntimeConfig();

const selectedRPC = ref();
const isWithCustomRPC = ref(false);

const rpcs = config.network.rpcs.split(",");
const chainId = config.network.chainId;

function onSubmit() {
  const newRpc = selectedRPC.value.toString();
  const spogStore = useSpogClientStore();
  spogStore.setRpc(newRpc);
  return navigateTo("/");
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
