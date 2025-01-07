<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center gap-4">
        <img
          class="h-[var(--header-height)]"
          src="~/assets/images/m0_white_black.png"
        />
        {{ name }}
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <ConnectButton class="hidden lg:block" />
        <HeaderEcosystemMenu />
      </div>
    </template>

    <template #panel>
      <UAsideLinks :links="links" />
      <UDivider class="my-4" />
      <ConnectButton class="lg:hidden" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
const { name } = useAppConfig();

const links = [
  {
    id: "home",
    label: "Vote",
    to: "/proposals",
  },
  {
    id: "proposals",
    label: "History",
    to: "/history",
  },
  {
    id: "actors",
    label: "Actors",
    to: "/actors/protocol",
  },
  {
    id: "config",
    label: "Config",
    to: "/config/governance",
  },
  {
    id: "profile",
    label: "Profile",
    to: "/profile/me",
  },
];
</script>
