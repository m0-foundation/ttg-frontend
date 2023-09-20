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
import { SPOG, Config } from "@/lib/api";

const config = useRuntimeConfig();
const nuxtApp = useNuxtApp();
const spogStore = useSpogClientStore();

const { rpc } = storeToRefs(spogStore);
const isLoading = ref(true);

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

const fetchSpogValues = async (spog: SPOG) => {
  try {
    const data = await spog.getSpogValues();
    const store = useSpogStore();
    store.setValues(data);
  } catch (error) {
    console.error({ error });
  }
};

const fetchProposals = async (spog: SPOG) => {
  try {
    const data = await spog.getProposals();
    const proposalStore = useProposalsStore();
    proposalStore.setProposals(data);
    console.log("fetched Proposals", { data });
  } catch (error) {
    console.error({ error });
  }
};

const fetchEpoch = async (spog: SPOG) => {
  try {
    const data = await spog.getEpochState();
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
  const configVars = config.public.contracts as Config;
  const spogClient = new SPOG(rpc, configVars);
  spogStore.setClient(spogClient);

  await Promise.all([
    fetchSpogContracts(spogClient),
    fetchSpogValues(spogClient),
  ]);
  return spogClient;
}

await onSetup(rpc.value).then(async (client) => {
  isLoading.value = true;
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
