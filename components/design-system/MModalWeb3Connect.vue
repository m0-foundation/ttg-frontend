<template>
  <div>
    <MButton @click="open = true">Connect Wallet</MButton>

    <Teleport to="body">
      <div
        v-if="open"
        id="modal-backdrop"
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-80"
      >
        <div class="flex items-start justify-center min-h-screen pt-24">
          <div class="p-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/3">
            <div class="flex flex-wrap flex-col shadow-xl">
              <button
                class="p-4 border text-white mb-2 self-end"
                @click="open = false"
              >
                x
              </button>

              <div class="bg-body-dark text-white p-8">
                <p class="text-2xl text-center">Connect Wallet</p>
                <p class="text-sm text-gray-300">
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

import { useAccount, useConnect } from "use-wagmi";

const images = {
  MetaMask: "/img/icon-metamask.svg",
  "Coinbase Wallet": "/img/icon-coinbase.svg",
  WalletConnect: "/img/icon-walletconnect.svg",
};

const open = ref(false);

const { connector, isReconnecting } = useAccount();
const { connect, connectors, isLoading, pendingConnector } = useConnect({
  onError: (e) => console.error("error", e.message),
});
</script>
