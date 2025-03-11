<template>
  <section>
    <PageTitle>
      <template #title>Actors</template>
    </PageTitle>

    <Suspense>
      <UContainer class="py-10">
        <NuxtPage />
      </UContainer>
      <template #fallback><CommonLoader /></template>
    </Suspense>
  </section>
</template>

<script setup lang="ts">
  const actorsLinks = [
    {
      label: 'Protocol',
      to: '/actors/protocol',
    },
    {
      label: 'M wrapped',
      to: '/actors/wm',
    },
  ]
</script>
