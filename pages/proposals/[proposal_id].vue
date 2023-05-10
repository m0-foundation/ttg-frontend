<template>
  <LayoutPage>
    <p>{{ $route.params.proposal_id }}</p>
  </LayoutPage>
</template>

<script setup>
definePageMeta({
  layout: "with-navbar",
});
</script>
