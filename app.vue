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

const fetchGovernorsData = async (api: Api) => {
  try {
    const [standard, emergency, zero] = await Promise.all([
      api.standardGovernor!.getParameters<Partial<MStandardGovernorValues>>([
        "proposalFee",
        "cashToken",
        "maxTotalZeroRewardPerActiveEpoch",
      ]),
      api.emergencyGovernor!.getParameters<Partial<MGovernorValues>>([
        "thresholdRatio",
      ]),
      api.zeroGovernor!.getParameters<Partial<MGovernorValues>>([
        "thresholdRatio",
      ]),
    ]);

    spog.contracts.cashToken = standard.cashToken;

    spog.setGovernorsValues({
      standard,
      emergency,
      zero,
    });
    await spog.fetchTokens();
  } catch (error) {
    console.error({ error });
  }
};

const fetchProposals = async (api: Api) => {
  try {
    // const data = await api.standardGovernor!.proposals.getProposals();
    // const data = await api.emergencyGovernor!.proposals.getProposals();
    // const data = await api.zeroGovernor!.proposals.getProposals();

    const [standard, emergency, zero] = await Promise.all([
      api.standardGovernor!.proposals.getProposals(),
      api.emergencyGovernor!.proposals.getProposals(),
      api.zeroGovernor!.proposals.getProposals(),
    ]);
    const allProposals = [...standard, ...emergency, ...zero];
    const proposalStore = useProposalsStore();
    proposalStore.setProposals(allProposals);
    console.log("fetched Proposals", { allProposals });
  } catch (error) {
    console.error({ error });
  }
};

const fetchEpoch = async (api: Api) => {
  try {
    const data = await api.epoch.getEpochState();
    const store = useSpogStore();
    store.setEpoch(data);
    console.log("fetched Epoch", { data });
  } catch (error) {
    console.error({ error });
  }
};

const fetchVotes = () => {
  const votes = useVotesStore();
  return votes.fetchAllVotes();
};

async function onSetup(rpc: string) {
  console.log("onSetup with rpc", rpc);
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

await onSetup(rpc.value).then(async (api) => {
  isLoading.value = true;
  await Promise.all([
    fetchGovernorsData(api),
    fetchProposals(api),
    fetchEpoch(api),
    fetchVotes(),
  ]);

  watchProposalCreated();
  watchVoteCast();
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
