<template>
  <div>
    <LayoutHeader />
    <!-- out content -->
    <div class="mx-auto w-full md:w-3/4 xl:w-1/2">
      <!-- innter content -->
      <div class="p-8">
        <LayoutNavbar />
      </div>

      <NuxtPage />
    </div>
    <LayoutFooter />
  </div>
</template>

<script lang="ts" setup>
import { configureChains, sepolia, createClient } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [sepolia],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
</script>
