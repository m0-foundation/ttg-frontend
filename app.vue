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
import { mainnet, sepolia, hardhat } from "@wagmi/core/chains";
import { storeToRefs } from "pinia";
import { SPOG, ConfigVars } from "@/lib/api";
console.log("app");

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const spogStore = useSpogClientStore();

const { rpc } = storeToRefs(spogStore);

function onSetup(rpc: string) {
  console.log("onSetup with rpc", rpc);
  /* setup wagmi client as vue plugin */
  const { client: wagmiClient } = useWagmi(rpc);
  nuxtApp.vueApp.use(wagmiClient);

  /* setup spog client */
  const configVars = config.contracts as ConfigVars;
  const spogClient = new SPOG(rpc, hardhat, configVars);
  spogStore.setClient(spogClient);
  return spogClient;
}

const spogClient = onSetup(rpc.value);
console.log({ spogClient });
/* download all proposals */
const { isLoading } = useAsyncState(spogClient.getProposals(), 0, {
  onSuccess: (data) => {
    console.log("getGovernorVoteProposals", { data });
    const proposalStore = useProposalsStore();
    proposalStore.setProposals(data);
  },
  onError: (e) => {
    console.error({ e });
  },
});

const { isLoading: epochStateIsLoading } = useAsyncState(
  spogClient.getEpochState(),
  0,
  {
    onSuccess: (data) => {
      console.log("getEpochState", { data });
      const store = useSpogStateStore();
      store.setEpoch(data);
    },
    onError: (e) => {
      console.error({ e });
    },
  }
);

/* user has updated the rpc */
watch(
  rpc,
  (newRpc) => {
    console.log("rpc has changed", { newRpc });
    onSetup(newRpc);
  },
  { deep: true }
);
</script>
