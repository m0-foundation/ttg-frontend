<template>
  <section>
    <PageTitle>
      <template #title>Actors</template>
    </PageTitle>

    <Suspense>
      <UContainer class="lg:py-10 py-4">
        <NuxtPage />
      </UContainer>
      <template #fallback><CommonLoader /></template>
    </Suspense>
  </section>
</template>
