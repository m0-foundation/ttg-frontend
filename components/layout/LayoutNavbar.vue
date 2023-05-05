<template>
  <nav class="text-white text-xl p-8">
    <NuxtLink to="/proposals/active">
      <MNavButton>Proposals</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/merchants">
      <MNavButton>Approved Lists</MNavButton>
    </NuxtLink>
  </nav>

  <div
    v-if="$route.path === '/' || $route.path.includes('/proposals')"
    class="text-white text-xs bg-black p-8"
  >
    <NuxtLink to="/proposals/active">
      <MNavButton>Active</MNavButton>
    </NuxtLink>
    <NuxtLink to="/proposals/scheduled">
      <MNavButton>Scheduled</MNavButton>
    </NuxtLink>
    <NuxtLink to="/proposals/history">
      <MNavButton>Voting History</MNavButton>
    </NuxtLink>
  </div>

  <div
    v-if="$route.path.includes('/lists')"
    class="text-white text-xs bg-black p-8"
  >
    <NuxtLink to="/lists/merchants">
      <MNavButton>Merchants</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/data-validators">
      <MNavButton>Data Validators</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/collateral">
      <MNavButton>Collateral</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/managers">
      <MNavButton>Managers</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/stablecoins">
      <MNavButton>Stablecoins</MNavButton>
    </NuxtLink>
    <NuxtLink to="/lists/yield-boxes">
      <MNavButton>Yield Boxes</MNavButton>
    </NuxtLink>
  </div>
</template>
