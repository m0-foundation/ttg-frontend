<template>
  <MDropdown origin="right">
    <ul class="token-menu-items">
      <li>
        <a @click="copyToClipboard(token?.address)">
          <p>{{ `Copy ${token?.symbol} token address` }}</p>
          <p class="text-grey-500 text-xxs">{{ token?.address }}</p>
        </a>
      </li>
      <li>
        <a @click="addTokenToWallet"> Add Token to your wallet </a>
      </li>
      <li>
        <a target="_blank" :href="useBlockExplorer('token', token?.address)">
          View on Block Explorer
        </a>
      </li>
    </ul>
  </MDropdown>
</template>

<script setup>
import { copyToClipboard } from "@/utils/misc";
const props = defineProps({
  token: {
    type: Object,
    required: true,
  },
});

async function addTokenToWallet() {
  try {
    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: props.token?.address,
          symbol: props.token?.symbol,
          decimals: props.token?.decimals,
          // image: tokenImage, // A string url of the token logo
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}
</script>

<style>
.token-menu-items {
  @apply bg-grey-700 shadow-sm shadow-grey-1000 font-inter;
}
.token-menu-items li a {
  @apply p-6 py-4 block hover:bg-grey-900 whitespace-nowrap cursor-pointer;
}

.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
