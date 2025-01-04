<template>
  <UPopover>
    <UButton
      color="white"
      label="Ecosystem"
      variant="ghost"
      class="font-inter active:bg-gray-300"
    >
      <template #trailing>
        <img src="~/assets/icons/ecosystem/ecosystem-dots.svg" />
      </template>
    </UButton>

    <template #panel>
      <div class="p-6 border-none">
        <div class="flex justify-between gap-6">
          <NuxtLink
            v-for="app in apps"
            :key="app.name"
            external
            :to="app.link"
            target="_blank"
            class="hover:opacity-90"
          >
            <div class="flex justify-center mb-1">
              <img :src="app.icon" />
            </div>
            <h4 class="text-grey-800 text-sm">{{ app.name }}</h4>
          </NuxtLink>
        </div>
        <UDivider class="my-3" />
        <UVerticalNavigation
          :ui="{ base: 'font-inter underline text-grey-500', padding: 'p-1' }"
          :links="links"
        />
      </div>
    </template>
  </UPopover>
</template>

<script setup>
import squareBlack from "~/assets/icons/ecosystem/square-black.svg";
import squareBlue from "~/assets/icons/ecosystem/square-blue.svg";

const apps = [
  {
    name: "Governance",
    icon: squareBlack,
    link: "https://governance.m0.org",
  },
  {
    name: "Dashboard",
    icon: squareBlue,
    link: "https://dashboard.m0.org",
  },
];

const links = [
  {
    label: "Research",
    to: "https://research.m0.org",
    target: "_blank",
  },
  {
    label: "Documentation portal",
    to: "https://docs.m0.org",
    target: "_blank",
  },
  {
    label: "M^0 Foundation",
    to: "https://m0.org",
    target: "_blank",
  },
];
</script>
