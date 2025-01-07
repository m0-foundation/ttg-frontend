<template>
  <UHeader :links="links" :ui="{ container: 'h-12' }">
    <template #logo>
      <div class="flex items-center gap-4">
        <img class="h-12" src="~/assets/images/m0_white_black.png" />
        {{ name }}
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <ConnectButton class="hidden lg:block" />
        <HeaderEcosystemMenu />
      </div>
    </template>

    <template #center>
      <UHorizontalNavigation :links="links" class="w-fit hidden lg:block" />
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
