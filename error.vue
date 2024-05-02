<template>
  <div
    class="text-grey-200 min-h-dvh flex gap-4 flex-col items-center justify-center"
  >
    <template v-if="error.statusCode === 404">
      <h1>404!</h1>
      <p>Sorry, that page doesn't exist.</p>
    </template>
    <template v-else>
      <h1>Error</h1>
      <p>It looks like something broke.</p>
      <p>
        <strong>Message: {{ error.message }}</strong>
      </p>
    </template>
    <NuxtLink to="/">
      <MButton>Go to homepage</MButton>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: Object as () => NuxtError,
});
</script>

<style scoped>
h1 {
  @apply text-8xl font-ppformula;
}
p {
  @apply font-inter;
}
</style>
