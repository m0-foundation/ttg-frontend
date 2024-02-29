<template>
  <div>
    <div v-if="alerts.reset.show">
      <MAlertBannerReset :proposal="(alerts.reset.proposal as MProposal)" />
    </div>

    <div class="fixed top-10 right-5 grid grid-cols-1 gap-2">
      <div v-for="alert in alerts.items" :key="alert.id">
        <MAlert
          :id="alert.id"
          :message="alert.message"
          :type="alert.type"
          @dismiss="dismissAlert"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MProposal } from "@/lib/api/types";
const alerts = useAlertsStore();

function dismissAlert(id: number) {
  alerts.removeAlert(id);
}
</script>
