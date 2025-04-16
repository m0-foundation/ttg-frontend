<template>
  <UPopover>
    <UButton
      color="black"
      :ui="{
        icon: { size: { md: 'w-4 h-4' } },
        color: { black: { solid: 'text-white bg-transparent' } },
      }"
      trailing-icon="i-mdi-dots-grid">
      <template #default>
        <span class="hidden xl:block">Ecosystem</span>
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
            class="hover:opacity-90">
            <div class="flex justify-center mb-1">
              <img :src="app.icon" class="h-12" />
            </div>
            <h4 class="text-grey-800 text-sm font-inter">{{ app.name }}</h4>
          </NuxtLink>
        </div>
        <UDivider class="my-3" />
        <UVerticalNavigation
          :ui="{
            base: 'font-inter underline text-grey-500 font-regular',
            padding: 'p-1',
            font: 'font-normal',
          }"
          :links="links" />
      </div>
    </template>
  </UPopover>
</template>

<script setup>
  import governanceIcon from '~/assets/icons/ecosystem/governance.svg'
  import dashboardIcon from '~/assets/icons/ecosystem/dashboard.svg'

  const apps = [
    {
      name: 'Governance',
      icon: governanceIcon,
      link: 'https://governance.m0.org',
    },
    {
      name: 'Dashboard',
      icon: dashboardIcon,
      link: 'https://dashboard.m0.org',
    },
  ]

  const links = [
    {
      label: 'Research',
      to: 'https://research.m0.org',
      target: '_blank',
    },
    {
      label: 'Documentation portal',
      to: 'https://docs.m0.org',
      target: '_blank',
    },
    {
      label: 'M0 Foundation',
      to: 'https://m0.org',
      target: '_blank',
    },
  ]
</script>
