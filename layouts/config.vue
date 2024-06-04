<template>
  <div class="px-6 lg:p-0">
    <PageTitle>
      <template #default>Configs</template>
    </PageTitle>

    <div
      class="flex gap-6 whitespace-nowrap overflow-x-auto text-grey-500 mb-6"
    >
      <NuxtLink
        to="/config/governance/"
        class="link-tab"
        active-class="active-link-tab"
      >
        Governance
      </NuxtLink>

      <NuxtLink
        to="/config/protocol/"
        class="link-tab"
        active-class="active-link-tab"
      >
        Protocol
      </NuxtLink>

      <NuxtLink
        to="/config/guidance/"
        class="link-tab"
        active-class="active-link-tab"
      >
        Guidance
      </NuxtLink>
    </div>

    <Suspense>
      <slot />
      <template #fallback> Loading... </template>
    </Suspense>
  </div>
</template>

<style>
.config-key-badge {
  @apply inline-block py-0.5 px-1.5 bg-grey-700 bg-opacity-85 border border-grey-700 text-grey-500 text-xxs font-inter;
}
.link-tab {
  @apply text-grey-500;
}
.active-link-tab {
  @apply text-grey-200;
}
</style>
