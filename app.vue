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
import { SPOG, Config, EpochState, SpogImmutableValues } from "@/lib/api";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const spogStore = useSpogClientStore();

const { rpc } = storeToRefs(spogStore);
const canLoadProposals = ref(false);
const isLoading = ref(false);

function onSetup(rpc: string) {
  console.log("onSetup with rpc", rpc);
  /* setup wagmi client as vue plugin */
  const { client: wagmiClient } = useWagmi(rpc);
  nuxtApp.vueApp.use(UseWagmiPlugin, wagmiClient);

  /* setup spog client */
  const network = [mainnet, sepolia, hardhat].filter(
    (chain) => chain.id === config.network.chainId
  )[0];
  const configVars = config.contracts as Config;
  const spogClient = new SPOG(rpc, network, configVars);
  spogStore.setClient(spogClient);
  return spogClient;
}

const spogClient = onSetup(rpc.value);
console.log({ spogClient });

const { isLoading: spogParametersIsLoading } = useAsyncState(
  spogClient.getContracts(),
  {} as SpogImmutableValues,
  {
    onSuccess: (data) => {
      console.log("getContracts", { data });
      const store = useSpogStore();
      store.setContracts(data);
      const newConfig = { contracts: data };
      spogClient.addConfig(newConfig);
      canLoadProposals.value = true;
    },
    onError: (e) => {
      console.error({ e });
    },
  }
);

watch(canLoadProposals, () => {
  console.log("canLoadProposals");
  const { isLoading: proposalsIsLoading } = useAsyncState(
    spogClient.getProposals(),
    [],
    {
      onSuccess: (data) => {
        console.log("getGovernorVoteProposals", { data });
        const proposalStore = useProposalsStore();
        proposalStore.setProposals(data);
        isLoading.value = false;
      },
      onError: (e) => {
        console.error({ e });
      },
    }
  );

  const { isLoading: epochStateIsLoading } = useAsyncState(
    spogClient.getEpochState(),
    {} as EpochState,
    {
      onSuccess: (data) => {
        console.log("getEpochState", { data });
        const store = useSpogStore();
        store.setEpoch(data);
      },
      onError: (e) => {
        console.error({ e });
      },
    }
  );
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
