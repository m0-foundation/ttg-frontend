<template>
  <span class="inline-flex items-center">
    <div v-if="showAvatar" class="address-avatar">
      <img v-if="ensAvatar" :src="ensAvatar" alt="" />
      <img v-else :src="identiconIcon" />
    </div>
    <span :class="{ 'ml-5': showAvatar }">
      <span v-if="ensName">{{ ensName }}</span>
      <span v-else>{{
        shortAddress ? shortenAddress(props.address) : props.address
      }}</span>
    </span>
  </span>
</template>
<script setup lang="ts">
import { useEnsAvatar, useEnsName } from "use-wagmi";
import { Hash } from "viem";
import Identicon from "identicon.js";

export interface MAddressAvatar {
  address: Hash | undefined;
  shortAddress: boolean;
  showAvatar: boolean;
}

const props = withDefaults(defineProps<MAddressAvatar>(), {
  address: undefined,
  shortAddress: true,
  showAvatar: true,
});

const { data: ensName } = useEnsName({
  address: props.address,
});

const { data: ensAvatar } = useEnsAvatar({
  name: props.address,
});

const identiconIcon = computed(() => {
  const identicon = new Identicon(props.address || "", {
    size: 16,
    format: "svg",
  });

  return `data:image/svg+xml;base64,${identicon}`;
});
</script>

<style>
.address-avatar {
  position: absolute;
  display: flex;
  align-items: center;
}
.address-avatar img {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
</style>
