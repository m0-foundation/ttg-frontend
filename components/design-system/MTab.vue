<script setup>
defineProps({
  active: {
    type: Boolean,
  },
});
</script>

<template>
  <div ref="tabs" class="m-tab" :class="active == 'true' ? 'active' : ''">
    <slot></slot>
  </div>
</template>

<style>
.m-tab {
  @apply hidden;
}
.m-tab.active-tab {
  @apply block;
}
</style>
