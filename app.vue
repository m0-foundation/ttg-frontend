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
      <div v-if="isLoading">Loading...</div>
      <NuxtPage v-else />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
// chains
import { mainnet, sepolia } from "@wagmi/core/chains";
import { SPOG, ConfigVars } from "@/lib/sdk";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();

console.log("init app with rpc", config.public.network.defaultRpc);
const defaultRpc = config.public.network.defaultRpc as string;
const rpc = useLocalStorage("m0.rpc", defaultRpc);
// * setup wagmi client */
const { client: wagmiClient } = useEthereum(rpc.value); // TODO? support mainnet
nuxtApp.vueApp.use(wagmiClient);
nuxtApp.provide("wagmiClient", wagmiClient);

// * setup spog client */
const configVars = config.contracts as ConfigVars;
const spogClient = new SPOG(rpc.value, sepolia, configVars);
nuxtApp.provide("spogClient", spogClient);

const store = useProposalsStore();
const { isLoading } = useAsyncState(spogClient.getGovernorVoteProposals(), 0, {
  onSuccess: (data) => {
    store.setProposals(data);
  },
});
</script>
