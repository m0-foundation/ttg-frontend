<template>
  <form class="p-6 mx-auto max-w-3xl" @submit.prevent="onSubmit">
    <PageTitle class="mb-8 lg:p-0">
      Settings
      <template #subtitle>
        For enhanced security measures, we suggest using a custom RPC URL. This
        entails either setting up your own RPC Node or contracting third-party
        services. In the latter scenario, you may opt to utilize a public RPC
        from this
        <NuxtLink
          href="https://chainlist.org/chain/1"
          target="_blank"
          class="underline hover:no-underline"
        >
          list.
        </NuxtLink>
      </template>
    </PageTitle>

    <div>
      <div class="mb-6">
        <div class="flex justify-between text-sm">
          <label>Network Id: </label>
          <label class="underline">{{ chainId }}</label>
        </div>
      </div>

      <div>
        <label>RPC URL</label>

        <input
          v-model="customRPC"
          type="text"
          placeholder="http://..."
          data-test="settings-input-url-rpc"
          class="mb-2"
        />
      </div>

      <div class="flex justify-end">
        <MButton type="submit" data-test="settings-button-submit">
          Save
        </MButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "page",
});

const alerts = useAlertsStore();
const apiStore = useApiClientStore();
const networkStore = useNetworkStore();

const currentNetwork = networkStore.getNetwork();

const customRPC = ref(apiStore.rpc);
const chainId = computed(() => currentNetwork.value.rpc.chainId);

useHead({
  titleTemplate: "%s - Settings",
});

function onSubmit() {
  console.log("submitting", customRPC.value);
  const newRpc = unref(customRPC);
  if (!newRpc) return;
  if (newRpc.startsWith("http:"))
    return alerts.errorAlert("Only https (secure) connections allowed");

  apiStore.setRpc(newRpc);

  reloadNuxtApp({ path: "/", force: true });
}
</script>

<style>
.rpc-button {
  @apply underline text-grey-600 text-xs mt-2;
}
</style>
