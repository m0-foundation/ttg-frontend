<template>
  <MButtonRadio v-if="batch" v-bind="$attrs" :version="version">
    <slot />
  </MButtonRadio>
  <MButton v-else v-bind="$attrs"><slot /></MButton>
</template>

<script lang="ts" setup>
export interface Props {
  version: "default" | "active";
  batch: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  version: "default",
  batch: false,
});

const version = computed(() => props.version);
</script>
