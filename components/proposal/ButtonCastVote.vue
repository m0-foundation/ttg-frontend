<template>
  <button type="button" :class="version" @click="onClick">
    <slot />
  </button>
</template>

<script lang="ts" setup>
const isActive = ref(false);
export interface Props {
  version: "default" | "active" | "disabled";
}

const props = withDefaults(defineProps<Props>(), {
  version: "default",
});

const version = computed(() => {
  return isActive.value ? "active" : props.version;
});

function onClick() {
  isActive.value = !isActive.value;
}
</script>
<style scoped>
button {
  @apply uppercase font-medium text-sm px-4 py-2 text-center mr-3 md:mr-0;
}

button:disabled {
  @apply opacity-50 cursor-not-allowed bg-primary-dark;
}

.default {
  @apply text-black bg-primary hover:bg-primary-dark;
}

.active {
  @apply text-white bg-primary-darker;
}

.disabled {
  @apply border border-grey-400 text-grey-400 bg-white;
}
</style>
