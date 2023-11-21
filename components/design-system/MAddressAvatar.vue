<template>
  <span class="inline-flex items-center">
    <div v-if="showAvatar" class="absolute flex items-center">
      <img
        v-if="ensAvatar"
        class="w-4 h-4 rounded-full"
        :src="ensAvatar"
        alt=""
      />
      <Jazzicon v-else :address="props?.address" diameter="16" />
    </div>
    <span :class="{ 'ml-6': showAvatar }">
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
import { Jazzicon } from "vue3-jazzicon/src/components";

export interface MAddressAvatar {
  address: Hash | undefined;
  shortAddress?: boolean;
  showAvatar?: boolean;
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
  name: ensName,
});
</script>
