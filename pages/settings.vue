<template>
  <LayoutPage>
    <div>
      <div class="text-center text-xl text-grey-primary tracking-widest mb-4">
        <MButton version="secondary-dark" @click="selectedTab = 0">
          RPC
        </MButton>
        <MButton version="secondary-dark" @click="selectedTab = 1">
          Wallet
        </MButton>
      </div>

      <div>
        <SettingsRpc v-show="selectedTab === 0" />
        <SettingsWallet v-show="selectedTab === 1" />
      </div>
    </div>
  </LayoutPage>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "with-navbar",
});

const selectedTab = ref(0);
</script>
