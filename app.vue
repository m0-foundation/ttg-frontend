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
import { UseWagmiPlugin } from "use-wagmi";
// chains
import { mainnet, sepolia, hardhat } from "@wagmi/core/chains";
import { storeToRefs } from "pinia";
import { SPOG, Config } from "@/lib/api";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const spogStore = useSpogClientStore();

const { rpc } = storeToRefs(spogStore);
const isLoading = ref(false);

// force hardhat network to allow multicall3
// @ts-ignore
hardhat.contracts = {
  multicall3: { address: config.public.contracts.multicall3, blockCreated: 3 },
};

const fetchSpogContracts = async (spog: SPOG) => {
  try {
    const data = await spog.getContracts();
    const store = useSpogStore();
    store.setContracts(data);

    const newConfig = { contracts: data };
    spog.addConfig(newConfig);
  } catch (error) {
    console.error({ error });
  }
};

const fetchProposals = async (spog: SPOG) => {
  try {
    console.log("fetchProposals");
    const data = await spog.getProposals();
    const proposalStore = useProposalsStore();
    proposalStore.setProposals(data);
  } catch (error) {
    console.error({ error });
  }
};

const fetchEpoch = async (spog: SPOG) => {
  try {
    console.log("fetchEpoch");
    const data = await spog.getEpochState();
    const store = useSpogStore();
    store.setEpoch(data);
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
  const network = [mainnet, sepolia, hardhat].find(
    (chain) => chain.id === Number(config.public.network.chainId)
  );

  const configVars = config.public.contracts as Config;
  const spogClient = new SPOG(rpc, network!, configVars);
  spogStore.setClient(spogClient);

  await fetchSpogContracts(spogClient);
  return spogClient;
}

onSetup(rpc.value).then(async (client) => {
  await Promise.all([fetchProposals(client), fetchEpoch(client)]);
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
