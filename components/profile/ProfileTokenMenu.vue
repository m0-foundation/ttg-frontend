<template>
  <MDropdown>
    <ul class="dropdown-menu-items">
      <li>
        <a v-close-popper @click="copyTokenAddress(token)">
          <p>{{ `Copy ${token?.symbol} token address` }}</p>
          <p class="text-grey-500 text-xxs">{{ token?.address }}</p>
        </a>
      </li>
      <li v-if="isConnected">
        <a v-close-popper @click="addTokenToWallet">
          Add Token to your wallet
        </a>
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
import { useAccount } from "use-wagmi";

const props = defineProps({
  token: {
    type: Object,
    required: true,
  },
});

const { isConnected } = useAccount();
const alerts = useAlertsStore();

async function copyTokenAddress(token) {
  copyToClipboard(token?.address);
  alerts.successAlert(`${token?.symbol} token address copied to clipboard`);
}

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
