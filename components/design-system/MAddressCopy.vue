<template>
  <span class="inline-flex items-center relative font-inter">
    <div class="flex items-center gap-1">
      <div class="hover:underline">
        <a :href="useBlockExplorer('address', props.address)" target="_blank">
          {{ shortAddress ? shortenAddress(props.address) : props.address }}
        </a>
      </div>

      <img v-if="justCopied" class="min-w-5 h-5" src="/img/icons/check.svg" />
      <button v-else-if="showCopy" @click="copy(props.address)">
        <img class="min-w-5 h-5 hover:opacity-75" src="/img/icons/copy.svg" />
      </button>
    </div>
  </span>
</template>
<script setup lang="ts">
export interface MAddressCopy {
  address: string;
  shortAddress?: boolean;
  showCopy?: boolean;
}

const props = withDefaults(defineProps<MAddressCopy>(), {
  address: "",
  shortAddress: true,
  showAvatar: true,
  showCopy: false,
});

const justCopied = ref(false);

function copy(address: string) {
  copyToClipboard(address);
  justCopied.value = true;
  setTimeout(() => {
    justCopied.value = false;
  }, 2000);
}
</script>
