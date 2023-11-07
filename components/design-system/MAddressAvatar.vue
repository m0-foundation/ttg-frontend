<template>
  <span class="inline-flex items-center">
    <div v-if="ensAvatar" class="address-avatar">
      <img :src="ensAvatar" alt="" />
    </div>

    <span v-if="ensName">{{ ensName }}</span>
    <span v-else class="ml-5">{{
      shortAddress ? shortenAddress(props.address) : props.address
    }}</span>
  </span>
</template>
<script setup lang="ts">
import { useEnsAvatar, useEnsName } from "use-wagmi";
import { Hash } from "viem";

export interface MAddressAvatar {
  address: Hash | undefined;
  shortAddress: boolean;
}

const props = withDefaults(defineProps<MAddressAvatar>(), {
  address: undefined,
  shortAddress: true,
});

const { data: ensName } = useEnsName({
  address: props.address,
  chainId: 1,
});

const { data: ensAvatar } = useEnsAvatar({
  name: "jxom.eth",
  chainId: 1,
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
