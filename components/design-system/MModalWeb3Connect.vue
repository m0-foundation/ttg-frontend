<template>
  <div>
    <MButton @click="open = true">Connect Wallet</MButton>

    <Teleport to="body">
      <div
        v-if="open"
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
      >
        <div class="flex items-start justify-center min-h-screen pt-24">
          <div class="shadow-xl p-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div class="flex flex-wrap flex-col">
              <button
                class="p-4 border text-white mb-2 self-end"
                @click="open = false"
              >
                x
              </button>

              <div class="bg-white text-black p-4">
                <p class="text-xl">Connect Wallet</p>
                <p class="text-sm text-gray-600">
                  Connect with one of our available wallet providers or create a
                  new one.
                </p>

                <div class="mt-4 flex flex-wrap flex-col items-start">
                  <button
                    v-for="cc in connectors"
                    :key="cc.id"
                    class="rounde hover:underline border-b border-spacing-4 my-2 w-full text-left"
                    :disabled="
                      !cc.ready || isReconnecting || connector?.id === cc.id
                    "
                    @click="connect({ connector: cc })"
                  >
                    <span>{{ cc.name }}</span>
                    <span v-if="!cc.ready"> (unsupported)</span>
                    <span v-if="isLoading && cc.id === pendingConnector?.id">
                      …
                    </span>
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

<script lang="ts" setup>
import { ref } from "vue";
import { useAccount, useConnect } from "use-wagmi";

const open = ref(false);

const { connector, isReconnecting } = useAccount();
const { connect, connectors, isLoading, pendingConnector } = useConnect({
  onError: (e) => console.error("error", e.message),
});
</script>
