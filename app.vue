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
      <Suspense>
        <template #default>
          <NuxtPage />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { UseWagmiPlugin } from "use-wagmi";
import { storeToRefs } from "pinia";
import { Hash } from "viem";
import { Api } from "@/lib/api";
import {
  watchProposalCreated,
  watchVoteCast,
  watchForExecutedResetProposal,
} from "@/lib/watchers";

import { MStandardGovernorValues, MGovernorValues } from "@/lib/api/types";

const nuxtApp = useNuxtApp();
const network = useNetworkStore().getNetwork();

const apiStore = useApiClientStore();
const spog = useSpogStore();

const { rpc } = storeToRefs(apiStore);
const isLoading = ref(true);

async function onSetup(rpc: string) {
  /* setup wagmi client as vue plugin */
  const { client: wagmiClient } = useWagmi(rpc, network.value.rpc.values[1]);
  nuxtApp.vueApp.use(UseWagmiPlugin, wagmiClient);
  /* setup spog client */
  const api = new Api(rpc, {
    registrar: network.value.contracts.registrar,
    multicall3: network.value.contracts.multicall3,
    deploymentBlock: BigInt(network.value.contracts.deploymentBlock),
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

await onSetup(rpc.value).then(async () => {
  isLoading.value = true;
  const proposalStore = useProposalsStore();
  const votes = useVotesStore();

  const trackError = (error: Error, label: string) => {
    console.error(label, { error });
  };

  // this must go first
  await spog
    .fetchGovernorsValues()
    .catch((e) => trackError(e, "fetchGovernorsValues"));

  await Promise.all([
    spog.fetchTokens().catch((e) => trackError(e, "fetchTokens")),
    proposalStore
      .fetchAllProposals()
      .catch((e) => trackError(e, "fetchAllProposals")),
    votes.fetchAllVotes().catch((e) => trackError(e, "fetchAllVotes")),
  ]);

  await spog
    .fetchEpoch(spog.getValues.clock)
    .catch((e) => trackError(e, "fetchEpoch"));

  watchProposalCreated();
  watchVoteCast();
  watchForExecutedResetProposal();

  isLoading.value = false;
});

/* user has updated the rpc */
watch(
  rpc,
  (newRpc) => {
    onSetup(newRpc);
  },
  { deep: true }
);
</script>
