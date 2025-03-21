<template>
  <slot :connect="openModal">
    <UButton
      id="button-connect-wallet"
      data-test="modal-web3-button-connect-wallet"
      color="primary"
      @click="openModal">
      Connect wallet
    </UButton>
  </slot>

  <Teleport to="body">
    <div
      v-if="open"
      id="modal-backdrop"
      ref="modal-backdrop"
      class="fixed z-50 lg:z-40 inset-0 overflow-y-auto bg-grey-1000">
      <div class="flex items-center justify-center min-h-screen">
        <div ref="connectModal" class="w-full max-w-xl">
          <div class="flex flex-wrap flex-col">
            <div class="bg-grey-900 text-white p-3 lg:p-6">
              <p class="text-3xl text-center font-ppformula">Connect Wallet</p>
              <p
                class="font-inter text-center text-grey-500 leading-normal mt-2 max-sm:text-sm">
                Connect with one of our available wallet providers.
              </p>

              <div class="my-6 flex flex-wrap flex-col items-start">
                <button
                  v-for="cc in connectors"
                  :key="cc.uid"
                  class="flex justify-between hover:underline border-grey-700 border-t last:border-y border-dashed border-spacing-4 py-4 w-full text-left text-xl"
                  :disabled="isReconnecting || connector?.uid === cc.uid"
                  :data-test="`modal-web3-connect-button-${cc.name}`"
                  @click="connect({ connector: cc })">
                  <div class="flex justify-between items-center gap-4">
                    <img :src="images[cc.name]" class="max-h-6 w-6" />
                    <span class="font-inter">{{ cc.name }}</span>
                  </div>
                </button>
              </div>

              <div class="flex justify-center">
                <button
                  class="text-grey-200 self-end text-3xl p-2"
                  data-test="modal-web3-connect-button-close"
                  @click="open = false">
                  <img
                    src="/img/mobile/close-toggle.svg"
                    class="max-h-24"
                    @click="open = false" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
  import { ref } from 'vue'

  import { useAccount, useConnect, useSwitchChain } from 'use-wagmi'

  const images = {
    'Brave Wallet': '/img/wallets/brave.svg',
    'Coinbase Wallet': '/img/icon-coinbase.svg',
    Frame: '/img/wallets/frame.png',
    MetaMask: '/img/icon-metamask.svg',
    Safe: '/img/wallets/safe.svg',
    WalletConnect: '/img/icon-walletconnect.svg',
  }

  const open = ref(false)
  const connectModal = ref(null)
  const network = useNetworkStore().getNetwork()
  const chainId = computed(() => network.value.rpc.chainId)

  const { connector, isReconnecting } = useAccount()
  const { switchChain } = useSwitchChain()
  const { connect, connectors } = useConnect({
    onError: (e) => console.error('error', e.message),
    onSuccess: () => {
      switchChain({ chainId })
    },
  })

  const openModal = () => (open.value = true)
  const closeModal = () => (open.value = false)

  onClickOutside(connectModal, closeModal)
</script>
