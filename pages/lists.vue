<template>
  <div>
    <nav class="text-white text-xl p-8">
      <MNavButton>Lists<span class="text-primary">_</span></MNavButton>
    </nav>

    <div class="text-white text-xs bg-black p-8">
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

    <NuxtPage />
  </div>
</template>
