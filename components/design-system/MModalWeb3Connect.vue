<template>
  <div>
    <MButton
      id="button-connect-wallet"
      data-test="modal-web3-button-connect-wallet"
      @click="open = true"
    >
      Connect Wallet
    </MButton>

    <Teleport to="body">
      <div
        v-if="open"
        id="modal-backdrop"
        ref="modal-backdrop"
        class="fixed z-40 lg:z-40 inset-0 overflow-y-auto bg-grey-900"
      >
        <div class="flex items-center justify-center min-h-screen">
          <div class="w-full max-w-xl">
            <div class="flex flex-wrap flex-col">
              <div class="bg-grey-900 text-white p-8">
                <p class="text-2xl text-center">Connect Wallet</p>
                <p class="text-sm text-zinc-500 leading-normal mt-2">
                  Connect with one of our available wallet providers or create a
                  new one.
                </p>

                <div class="mt-4 flex flex-wrap flex-col items-start">
                  <button
                    v-for="cc in connectors"
                    :key="cc.id"
                    class="flex justify-between hover:underline border-b border-dashed border-spacing-4 my-4 w-full text-left pb-4 text-xl"
                    :disabled="
                      !cc.ready || isReconnecting || connector?.id === cc.id
                    "
                    :data-test="`modal-web3-connect-button-${cc.name}`"
                    @click="connect({ connector: cc })"
                  >
                    <div class="flex justify-between">
                      <img :src="images[cc.name]" class="mr-2" />
                      <span>{{ cc.name }}</span>
                    </div>
                    <div>
                      <span v-if="!cc.ready"> (unsupported)</span>
                      <span> > </span>
                    </div>
                  </button>
                </div>

                <div class="flex justify-center">
                  <button
                    class="p-4 text-white mb-2 self-end text-3xl"
                    data-test="modal-web3-connect-button-close"
                    @click="open = false"
                  >
                    x
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useAccount, useConnect, useSwitchChain } from "use-wagmi";

const images = {
  MetaMask: "/img/icon-metamask.svg",
  "Coinbase Wallet": "/img/icon-coinbase.svg",
  WalletConnect: "/img/icon-walletconnect.svg",
};

const open = ref(false);
const network = useNetworkStore().getNetwork();
const chainId = computed(() => network.value.rpc.chainId);

const { connector, isReconnecting } = useAccount();
const { switchChain } = useSwitchChain();
const { connect, connectors } = useConnect({
  onError: (e) => console.error("error", e.message),
  onSuccess: () => {
    switchChain({ chainId });
  },
});
</script>
