<template>
  <UDropdown :items="dropdownItems">
    <UButton color="gray" icon="i-heroicons-ellipsis-horizontal" />
  </UDropdown>
</template>

<script setup>
import { copyToClipboard } from "@/utils/misc";

const props = defineProps({
  token: {
    type: Object,
    required: true,
  },
});

const dropdownItems = ref([
  [
    {
      label: `Copy ${props.token?.symbol} token address`,
      icon: "i-heroicons-clipboard",
      click: () => copyTokenAddress(props.token),
    },
    {
      label: "Add token to wallet",
      icon: "i-heroicons-wallet",
      click: () => addTokenToWallet(),
    },
    {
      label: "View on block explorer",
      icon: "i-heroicons-globe-alt",
      to: useBlockExplorer("token", props.token?.address),
      target: "_blank",
    },
  ],
]);

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
