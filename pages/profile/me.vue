<template>
  <div v-if="address">
    <div class="flex justify-between gap-4">
      <div>
        <h1 class="text-2xl uppercase">
          my profile<span class="text-primary">_</span>
        </h1>
        <p class="text-grey-primary text-xs">
          {{ address }}
        </p>
      </div>
      <div>
        <MButton>
          <NuxtLink to="/delegate">re-delegate</NuxtLink>
        </MButton>
      </div>
    </div>
    <ProfileBalances :address="address" />
    <!-- tables -->
    <ProfileTables :address="address" />
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-primary"
  >
    User not conntecd
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";
const { address } = useAccount();
</script>
