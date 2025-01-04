<template>
  <div class="px-6 lg:p-0">
    <PageTitle>
      <template #default>Actors</template>
    </PageTitle>

    <div
      class="flex gap-6 whitespace-nowrap overflow-x-auto text-grey-500 mb-6"
    >
      <NuxtLink
        to="/actors/protocol/"
        class="link-tab"
        active-class="active-link-tab"
      >
        Protocol
      </NuxtLink>

      <NuxtLink
        to="/actors/wm/"
        class="link-tab"
        active-class="active-link-tab"
      >
        $M (wrapped)
      </NuxtLink>
    </div>

    <Suspense>
      <NuxtPage />
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
