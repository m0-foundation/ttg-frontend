<template>
  <LayoutPage>
    <div>
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
            @click="connect({ connector: cc })"
          >
            <span>{{ cc.name }}</span>
          </button>
        </div>
      </form>
    </div>
  </LayoutPage>
</template>

<script setup>
import { useAccount, useConnect } from "use-wagmi";

const { isConnected } = useAccount();

console.log("isConnected", isConnected.value);
if (isConnected.value) {
  await navigateTo("/proposals/active");
}

const { connect, connectors } = useConnect({
  onError: (e) => console.error("error", e.message),
  onSuccess: () => navigateTo("/proposals/active"),
});
</script>

<style scoped>
select,
input {
  @apply p-4 bg-transparent border border-white mb-2 block w-full;
}
</style>
