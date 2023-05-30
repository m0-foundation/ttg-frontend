<template>
  <LayoutPage>
    <p>{{ $route.params.list_id }}</p>
  </LayoutPage>
</template>

<script setup>
definePageMeta({
  layout: "with-navbar",
});
</script>
