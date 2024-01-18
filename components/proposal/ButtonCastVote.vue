<template>
  <MButtonRadio
    v-if="batch"
    v-bind="$attrs"
    :version="version"
    @click="onClick"
  >
    <slot />
  </MButtonRadio>
  <MButton v-else v-bind="$attrs" @click="onClick"><slot /></MButton>
</template>

<script lang="ts" setup>
const isActive = ref(false);
export interface Props {
  version: "default" | "active";
  batch: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  version: "default",
  batch: false,
});

const version = computed(() => {
  return isActive.value ? "active" : props.version;
});

function onClick() {
  isActive.value = !isActive.value;
}
</script>
