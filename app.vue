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

const nuxtApp = useNuxtApp();
const network = useNetworkStore().getNetwork();

const apiStore = useApiClientStore();
const spog = useSpogStore();

const { rpc } = storeToRefs(apiStore);
const isLoading = ref(true);

const fetchGovernorData = async (api: Api) => {
  try {
    const [contracts, values] = await Promise.all([
      api.governor!.getContracts(),
      api.governor!.getValues(),
    ]);

    spog.setContracts({
      ...contracts,
      governor: api.governor!.contract as string,
    });
    spog.setValues(values);
  } catch (error) {
    console.error({ error });
  }
};

const fetchProposals = async (api: Api) => {
  try {
    const data = await api.governor!.proposals.getProposals();
    const proposalStore = useProposalsStore();
    proposalStore.setProposals(data);
    console.log("fetched Proposals", { data });
  } catch (error) {
    console.error({ error });
  }
};

const fetchEpoch = async (api: Api) => {
  try {
    const data = await api.governor!.epoch.getEpochState();
    const store = useSpogStore();
    store.setEpoch(data);
    console.log("fetched Epoch", { data });
  } catch (error) {
    console.error({ error });
  }
};

async function onSetup(rpc: string) {
  console.log("onSetup with rpc", rpc);
  /* setup wagmi client as vue plugin */
  const { client: wagmiClient } = useWagmi(rpc);
  nuxtApp.vueApp.use(UseWagmiPlugin, wagmiClient);
  /* setup spog client */
  const api = new Api(rpc, {
    registrar: network.value.contracts.registrar,
    multicall3: network.value.contracts.multicall3,
  });

  const { governor } = await api.registrar.getContracts();
  api.setGovernor(governor as Hash);
  apiStore.setClient(api);

  return api;
}

await onSetup(rpc.value).then(async (api) => {
  isLoading.value = true;
  await Promise.all([
    fetchGovernorData(api),
    fetchProposals(api),
    fetchEpoch(api),
  ]);
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
