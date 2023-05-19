<template>
  <LayoutPage>
    <div>
      <div class="text-center text-xl text-grey-primary tracking-widest mb-4">
        [2/3]
      </div>
      <!-- step 1 -->
      <form @submit.prevent="onSubmit">
        <h1 class="text-center text-2xl">Connect wallet</h1>
        <p class="text-center text-grey-primary mb-8">
          Connect with one of our available wallet providers.
        </p>

        <div class="mt-4 flex flex-wrap flex-col items-start">
          <button
            v-for="cc in connectors"
            :key="cc.id"
            class="rounde hover:underline border-b border-spacing-4 my-2 w-full text-left"
            :disabled="!cc.ready || isReconnecting || connector?.id === cc.id"
            @click="connect({ connector: cc })"
          >
            <span>{{ cc.name }}</span>
            <span v-if="!cc.ready"> (unsupported)</span>
            <span v-if="isLoading && cc.id === pendingConnector?.id"> … </span>
          </button>
        </div>
      </form>
    </div>
  </LayoutPage>
</template>

<script setup>
import { ref } from "vue";
import { useAccount, useConnect } from "use-wagmi";

definePageMeta({
  layout: "with-only-logo",
});

const config = useRuntimeConfig();

const { isConnected, connector, isReconnecting } = useAccount();

if (isConnected) {
  await navigateTo("/proposals/active");
}

const { connect, connectors, isLoading, pendingConnector } = useConnect({
  onError: (e) => console.error("error", e.message),
});
</script>

<style scoped>
select,
input {
  @apply p-4 bg-transparent border border-white mb-2 block w-full;
}
</style>
