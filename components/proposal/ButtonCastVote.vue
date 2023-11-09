<template>
  <MButtonRadio
    class="grow lg:auto lg:grow-0"
    :class="version"
    @click="onClick"
  >
    <slot />
  </MButtonRadio>
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
