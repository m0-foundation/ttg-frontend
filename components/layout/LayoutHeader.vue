<template>
  <header class="">
    <div
      class="w-full flex flex-wrap items-center justify-between mx-auto px-16 py-8"
    >
      <a href="/" class="flex items-center">
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >
          M&#94;ZERO <span class="text-sm text-gray-400">Governance</span>
        </span>
      </a>

      <div v-if="address" class="flex md:order-2">
        <div class="mr-4">{{ address }}</div>
        <div class="text-white mr-4">
          Balance: {{ abcBalance?.formatted }} $ABC <br />
          cash: {{ cashBalance }} $ABC
        </div>

        <button @click="() => disconnect()">Disconnect</button>
      </div>
      <div v-else class="flex md:order-2">
        <MModalWeb3Connect />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { useAccount, useDisconnect, useBalance } from "use-wagmi";
import { parseAbiItem } from "viem";
import { readErc20Mock } from "~/lib/generated";

const cashBalance = ref();
const nuxtApp = useNuxtApp();
const { disconnect } = useDisconnect();
const { address } = useAccount({
  onConnect: async () => {
    cashBalance.value = await readErc20Mock({
      address: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
      functionName: "balanceOf",
      args: [address.value!],
    });
  },
  onDisconnect: () => console.log("disconnected"),
});

const {
  data: abcBalance,
  isError,
  isLoading,
} = useBalance({
  address,
  token: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
  watch: true,
});
</script>
