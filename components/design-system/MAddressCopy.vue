<template>
  <span class="inline-flex items-center relative font-inter">
    <div class="flex items-center gap-1">
      <div class="hover:underline">
        <a :href="useBlockExplorer('address', props.address)" target="_blank">
          {{ shortAddress ? shortenAddress(props.address) : props.address }}
        </a>
      </div>

      <UButton
        :icon="justCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
        variant="ghost"
        color="gray"
        size="xs"
        @click="copy(props.address)"
      />
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
