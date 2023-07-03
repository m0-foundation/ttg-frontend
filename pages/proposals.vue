<template>
  <div>
    <nav class="text-white text-xl p-8">
      <MNavButton>Proposals<span class="text-primary">_</span></MNavButton>
    </nav>

    <div class="text-white text-xs bg-black p-8">
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
    <NuxtPage />
  </div>
</template>
