<template>
  <div>
    <Head>
      <Title>M^0 | Governance</Title>
      <Meta charset="utf-8"></Meta>
      <Meta content="width=device-width, initial-scale=1" name="viewport" />
      <Meta content="/open-graph.jpg" property="og:image" />
      <Meta content="/favicon.jpg" property="twitter:image" />

      <Link
        href="https://governance.m0.org"
        rel="alternate"
        hreflang="x-default" />
      <Link
        href="https://governance.m0.org"
        rel="canonical"
        hreflang="x-default" />

      <Link href="/favicon.png" rel="shortcut icon" type="image/x-icon" />
      <link
        rel="manifest"
        href="/manifest.json"
        crossorigin="use-credentials" />
    </Head>

    <div v-if="isLoading" class="h-dvh flex items-center justify-center">
      <CommonLoader />
    </div>
    <NuxtLayout v-else />
  </div>
</template>

<script lang="ts" setup>
  import { UseWagmiPlugin } from 'use-wagmi'
  import { VueQueryPlugin } from '@tanstack/vue-query'
  import { storeToRefs } from 'pinia'
  import { wait } from '@/utils/misc'
  import { Api } from '@/lib/api'
  import { watchForExecutedResetProposal } from '@/lib/watchers'

  const nuxtApp = useNuxtApp()
  const network = useNetworkStore().getNetwork()

  const apiStore = useApiClientStore()
  const ttg = useTtgStore()
  const proposalStore = useProposalsStore()
  const votes = useVotesStore()

  const { rpc } = storeToRefs(apiStore)
  const isLoading = ref(true)

  async function onSetup(rpc: string) {
    /* setup wagmi client as vue plugin */
    const fallbackRpc = network.value.rpc.values![1]
    const wagmiConfig = useWagmi(rpc, fallbackRpc)
    nuxtApp.vueApp.use(UseWagmiPlugin, { config: wagmiConfig })
    nuxtApp.vueApp.use(VueQueryPlugin)
    /* setup ttg client */
    const api = new Api({
      rpcUrl: rpc,
      fallbackRpcUrl: fallbackRpc,
      config: {
        registrar: network.value.contracts.registrar,
        multicall3: network.value.contracts.multicall3,
        deploymentBlock: BigInt(network.value.contracts.deploymentBlock),
      },
    })

    const registrarValues = await api.registrar.getValues()
    ttg.setRegistrarValues(registrarValues)

    api.epoch.setEpoch(
      registrarValues.clockStartingTimestamp,
      registrarValues.clockPeriod,
    )

    api.setGovernors({
      standardGovernor: registrarValues.standardGovernor,
      zeroGovernor: registrarValues.zeroGovernor,
      emergencyGovernor: registrarValues.emergencyGovernor,
    })
    apiStore.setClient(api)

    return api
  }

  const trackError = (error: Error, label: string) =>
    console.error(label, { error })

  onMounted(async () => {
    if (rpc.value) {
      await onSetup(rpc.value!)

      // this must go first
      await ttg
        .fetchGovernorsValues()
        .catch((e) => trackError(e, 'fetchGovernorsValues'))

      await ttg.fetchTokens().catch((e) => trackError(e, 'fetchTokens'))

      await wait(200)

      await proposalStore
        .fetchAllProposals()
        .catch((e) => trackError(e, 'fetchAllProposals'))

      await wait(200)

      await votes.fetchAllVotes().catch((e) => trackError(e, 'fetchAllVotes'))
      await ttg
        .fetchEpoch(ttg.values.clock!)
        .catch((e) => trackError(e, 'fetchEpoch'))

      await ttg
        .fetchActorsLists()
        .catch((e) => trackError(e, 'fetchActorsLists'))

      watchForExecutedResetProposal()
    }

    isLoading.value = false
  })

  /* user has updated the rpc */
  watch(
    rpc,
    (newRpc) => {
      onSetup(newRpc!)
    },
    { deep: true },
  )
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
