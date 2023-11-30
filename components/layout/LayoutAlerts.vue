<template>
  <div v-if="alerts.reset.show">
    <MAlertBannerReset :proposal="alerts.reset.proposal" />
  </div>
</template>
<script setup lang="ts">
const alerts = useAlertsStore();
</script>
