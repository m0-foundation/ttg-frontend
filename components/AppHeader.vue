<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center gap-4">
        <img class="h-4 w-auto" src="~/assets/logos/m0.svg" />
        <UDivider
          orientation="vertical"
          class="dark:text-red-700 h-10"
          :ui="{ border: { base: 'dark:border-grey-700 border-grey-700' } }"
        />
        {{ name }}
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-1.5">
        <ConnectButton v-if="!isConnected" class="hidden lg:block" />
        <UButton
          v-if="isConnected"
          size="sm"
          label="Create proposal"
          :ui="{ size: { sm: 'text-xs' } }"
          to="/proposal/create"
          class="hidden lg:block"
          color="blue"
        />
        <HeaderProfilePopover v-if="isConnected" />
        <HeaderEcosystemMenu />
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="panelLinks" />
      <div v-if="!isConnected">
        <UDivider class="my-4" />
        <ConnectButton class="lg:hidden" />
      </div>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import { useAccount } from "use-wagmi";

const { name } = useAppConfig();
const { isConnected } = useAccount();

const links = computed(() => {
  return [
    {
      id: "home",
      label: "Home",
      to: "/proposals",
    },
    {
      id: "proposals",
      label: "Proposals",
      to: "/history",
    },
    {
      id: "actors",
      label: "Actors",
      to: "/actors",
    },
    {
      id: "config",
      label: "Config",
      to: "/config",
    },
    {
      id: "profile",
      label: "Profile",
      to: "/profile/me",
    },
  ];
});

const panelLinks = [
  ...links.value,
  {
    id: "create-proposal",
    label: "Create proposal",
    to: "/proposal/create",
  },
];
</script>
