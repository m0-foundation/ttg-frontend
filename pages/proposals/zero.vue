<template>
  <div>
    <MDialog ref="dialog">
      <template #header>Confirm your voting power</template>

      <template #body>
        <div>
          <div class="flex justify-start items-center gap-6 mb-4">
            <p>
              <MIconZero class="w-6 inline-block mr-2" />
              {{ useNumberFormatterPrice((votingPower as any)?.formatted) }}
            </p>
            <p class="uppercase text-xxs text-grey-600">voting power</p>
          </div>

          <p class="text-sm">
            This is your ZERO
            <u>voting power</u>
            which will be utilized to vote on this proposal base on the previous
            epoch.
          </p>
        </div>
      </template>
    </MDialog>

    <ProposalList
      :proposals="proposals"
      :loading="isLoading"
      @on-cast="castVote">
      <template #emptyState>
        <ProposalListEmptyState>No Zero proposals</ProposalListEmptyState>
      </template>
    </ProposalList>
  </div>
</template>

<script setup lang="ts">
  import { Abi, Hash } from 'viem'
  import { useAccount } from 'use-wagmi'
  import { writeContract, waitForTransactionReceipt } from '@wagmi/core'

  const proposalsStore = useProposalsStore()
  const wagmiConfig = useWagmiConfig()
  const alerts = useAlertsStore()

  useHead({
    titleTemplate: '%s - Zero proposals',
  })

  const { address: userAccount } = useAccount()
  const { forceSwitchChain } = useCorrectChain()

  const isLoading = ref(false)
  const selectedProposal = ref()

  const dialog = ref()
  const votingPower = ref()

  const proposals = computed(() =>
    proposalsStore.getProposalsTypeZero.filter((p) => p.state === 'Active'),
  )

  async function castVote(vote: number, proposalId: string) {
    await forceSwitchChain()

    selectedProposal.value = proposalId
    isLoading.value = true

    const governor = useGovernor({ proposalId })

    try {
      const hash = await writeContract(wagmiConfig, {
        address: governor!.address as Hash,
        abi: governor!.abi as Abi,
        functionName: 'castVote',
        args: [BigInt(proposalId), vote],
        account: userAccount.value,
      })

      const txReceipt = await waitForTransactionReceipt(wagmiConfig, {
        confirmations: 1,
        hash,
      })

      if (txReceipt.status !== 'success') {
        throw new Error('Transaction was not successful')
      }

      proposalsStore.updateProposalById(proposalId)

      alerts.successAlert('Vote casted successfully!')
    } catch (error: any) {
      console.log('Error casting vote', { error })

      if (error.transactionHash) {
        alerts.errorAlert(
          `Error when casting vote! <br/> See failed <a class="underline" target="_blank" href=${useBlockExplorer('tx', error.transactionHash)}>transaction</a>.`,
        )
      } else {
        alerts.errorAlert(`Transaction not sent! ${error.shortMessage}`)
      }
    } finally {
      isLoading.value = false
      selectedProposal.value = undefined
    }
  }
</script>
