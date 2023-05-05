<template>
  <div>
    <Head>
      <Title>M^ZER0 | Governance</Title>
      <Meta charset="utf-8"></Meta>
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
      <Meta content="/open-graph.jpg" property="og:image" />
      <Meta content="/favicon.jpg" property="twitter:image" />

      <Link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <Link href="/favicon.jpg" rel="apple-touch-icon" />
    </Head>
    <LayoutHeader />
    <!-- out content -->
    <div class="mx-auto w-full md:w-3/4 xl:w-1/2">
      <!-- innter content -->
      <LayoutNavbar />

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
