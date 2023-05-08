<template>
  <header class="">
    <div
      class="w-full flex flex-wrap items-center justify-between mx-auto px-16 py-8"
    >
      <a href="https://flowbite.com/" class="flex items-center">
        <span
          class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
        >
          Mˆ0 <span class="text-sm text-gray-400">Governance</span>
        </span>
      </a>

      <div v-if="address" class="flex md:order-2">
        <div class="mr-4">{{ address }}</div>
        <div class="text-white mr-4">Balance: {{ cashBalance }} $ABC</div>
        <button @click="() => disconnect()">Disconnect</button>
      </div>
      <div v-else class="flex md:order-2">
        <MModalWeb3Connect />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAccount, useDisconnect } from "use-wagmi";
import { readErc20Mock } from "~/lib/generated";

const cashBalance = ref();

const { disconnect } = useDisconnect();
const { address } = useAccount({
  onConnect: async (data) => {
    console.log({ data });
    cashBalance.value = await readErc20Mock({
      address: "0x8335Af67C928Ff9D4f9BE905de767cf252A83fe1",
      functionName: "balanceOf",
      args: ["0x31DCb7AE01fFfD9B6468814bA2A6A0ab9c58d8e5"],
    });
  },
  onDisconnect: () => console.log("disconnected"),
});
</script>
