<template>
  <span class="inline-flex items-center relative font-inter">
    <div v-if="showAvatar" class="absolute flex items-center">
      <img
        v-if="ensAvatar"
        class="w-4 h-4 rounded-full"
        :src="ensAvatar"
        alt=""
      />
      <Jazzicon
        v-else
        class="flex items-center"
        :address="props?.address"
        :diameter="16"
      />
    </div>
    <div class="flex items-center gap-1" :class="{ 'ml-[22px]': showAvatar }">
      <NuxtLink
        v-if="link"
        class="hover:underline"
        :to="`/profile/${props.address}`"
      >
        <span v-if="ensName">{{ ensName }}</span>
        <span v-else :title="props.address">{{
          shortAddress ? shortenAddress(props.address) : props.address
        }}</span>
      </NuxtLink>
      <span v-else class="leading-tight">
        <span v-if="ensName">{{ ensName }}</span>
        <span v-else :title="props.address">{{
          shortAddress ? shortenAddress(props.address) : props.address
        }}</span>
      </span>

      <UButton
        v-if="showCopy"
        variant="ghost"
        color="gray"
        size="xs"
        :padded="false"
        @click="copy(props.address)"
      >
        <template #trailing>
          <MIconCheck v-if="justCopied" />
          <MIconCopy v-else />
        </template>
      </UButton>
    </div>
  </span>
</template>
<script setup lang="ts">
import { useEnsAvatar, useEnsName } from "use-wagmi";
import { Hash, Address } from "viem";
import { Jazzicon } from "vue3-jazzicon/src/components";

export interface MAddressAvatar {
  address: Hash | undefined;
  shortAddress?: boolean;
  showAvatar?: boolean;
  showCopy?: boolean;
  link?: boolean;
}

const props = withDefaults(defineProps<MAddressAvatar>(), {
  address: undefined,
  shortAddress: true,
  showAvatar: true,
  showCopy: false,
  link: true,
});

const justCopied = ref(false);

function copy(address: Address) {
  copyToClipboard(address);
  justCopied.value = true;
  setTimeout(() => {
    justCopied.value = false;
  }, 2000);
}

const { data: ensName } = useEnsName({
  address: props.address,
});

const { data: ensAvatar } = useEnsAvatar({
  name: ensName,
});
</script>
