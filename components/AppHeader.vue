<template>
  <UHeader :links="links">
    <template #logo>
      <div class="flex items-center gap-4">
        <img
          class="h-[var(--header-height)]"
          src="~/assets/images/m0_white_black.png"
        />
        Governance
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <ConnectButton />
        <HeaderEcosystemMenu />
      </div>
    </template>
  </UHeader>
</template>

<script setup>
const links = [
  {
    id: "home",
    label: "Home",
    to: "/",
  },
  {
    id: "proposals",
    label: "Proposals",
    to: "/proposals/all/",
  },
  {
    id: "actors",
    label: "Actors",
    to: "/actors/protocol/",
  },
  {
    id: "config",
    label: "Config",
    to: "/config/governance/",
  },
  {
    id: "profile",
    label: "Profile",
    to: "/profile/me",
  },
];
</script>
