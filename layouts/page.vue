<template>
  <div>
    <div class="flex items-end gap-4 leading-4 pt-8 p-6 lg:pl-16">
      <NuxtLink to="/proposals">
        <img class="h-[24px]" src="/img/mzero-logo-white.svg" alt="" />
      </NuxtLink>
      <span class="text-grey-500 text-sm leading-3">Gov</span>
    </div>
    <!-- out content -->
    <div class="mb-16">
      <NuxtPage />
    </div>
    <LayoutAlerts />
    <LayoutFooter />
  </div>
</template>
