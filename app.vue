<template>
  <div>
    <Head>
      <Title>M^0 | Governance</Title>
      <Meta charset="utf-8"></Meta>
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
      <Meta content="/open-graph.jpg" property="og:image" />
      <Meta content="/favicon.jpg" property="twitter:image" />

      <Link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
      <Link href="/favicon.jpg" rel="apple-touch-icon" />
    </Head>

    <div v-if="isLoading" class="flex h-screen">
      <div class="m-auto inline-flex">
        <div>Loading</div>
        <div class="loader-dots"></div>
      </div>
    </div>
    <NuxtLayout v-else />
  </div>
</template>

<script lang="ts" setup>
import { UseWagmiPlugin } from "use-wagmi";
import { storeToRefs } from "pinia";
import { Api } from "@/lib/api";
import { watchForExecutedResetProposal } from "@/lib/watchers";

const nuxtApp = useNuxtApp();
const network = useNetworkStore().getNetwork();

const apiStore = useApiClientStore();
const spog = useSpogStore();
const proposalStore = useProposalsStore();
const votes = useVotesStore();

const { rpc } = storeToRefs(apiStore);
const isLoading = ref(true);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function onSetup(rpc: string) {
  console.log("onSetup with rpc", rpc);
  /* setup wagmi client as vue plugin */
  const fallbackRpc = network.value.rpc.values[1];
  const { client: wagmiClient } = useWagmi(rpc, fallbackRpc);
  nuxtApp.vueApp.use(UseWagmiPlugin, wagmiClient);
  /* setup spog client */
  const api = new Api({
    rpcUrl: rpc,
    fallbackRpcUrl: fallbackRpc,
    config: {
      registrar: network.value.contracts.registrar,
      multicall3: network.value.contracts.multicall3,
      deploymentBlock: BigInt(network.value.contracts.deploymentBlock),
    },
  });

  const registrarContracts = await api.registrar.getValues();
  spog.setContracts(registrarContracts);

  api.setGovernors({
    standardGovernor: registrarContracts.standardGovernor,
    zeroGovernor: registrarContracts.zeroGovernor,
    emergencyGovernor: registrarContracts.emergencyGovernor,
  });
  apiStore.setClient(api);

  return api;
}

const trackError = (error: Error, label: string) =>
  console.error(label, { error });

onMounted(async () => {
  await onSetup(rpc.value);

  // this must go first
  await spog
    .fetchGovernorsValues()
    .catch((e) => trackError(e, "fetchGovernorsValues"));

  await spog.fetchTokens().catch((e) => trackError(e, "fetchTokens"));

  await wait(200);

  await proposalStore
    .fetchAllProposals()
    .catch((e) => trackError(e, "fetchAllProposals"));

  await wait(200);

  await votes.fetchAllVotes().catch((e) => trackError(e, "fetchAllVotes"));
  await spog
    .fetchEpoch(spog.getValues.clock)
    .catch((e) => trackError(e, "fetchEpoch"));

  watchForExecutedResetProposal();

  isLoading.value = false;
});

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

<style>
.loader-dots {
  width: 18px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side, #fff 90%, #0000) 0 /
    calc(100% / 3) 100% space;
  clip-path: inset(0 100% 0 0);
  animation: l1 1s steps(4) infinite;

  margin-top: 10px;
  margin-left: 2px;
}
@keyframes l1 {
  to {
    clip-path: inset(0 -34% 0 0);
  }
}
</style>
