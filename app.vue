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

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
// chains
import { mainnet, sepolia } from "@wagmi/core/chains";
import { SPOG, ConfigVars } from "@/lib/sdk";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

// for every page reload must initialize without the need go to setup again
const hasRPC = localStorage.getItem("m0:rpc");
console.log("app", { hasRPC });
if (hasRPC) {
  console.log("init app");
  const { client } = useEthereum(hasRPC); // TODO? support mainnet
  nuxtApp.vueApp.use(client);

  const configVars = config.contracts as ConfigVars;
  const spogClient = new SPOG(config.ALCHEMY_URL, sepolia, configVars);
  nuxtApp.provide("spogClient", spogClient);
} else {
  await navigateTo("/setup/1");
}
</script>
