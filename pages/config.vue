<template>
  <section>
    <PageTitle>
      <template #title>Configs</template>
      <template #bottom-left>
        <UHorizontalNavigation
          :links="configLinks"
          class="border-b border-gray-200 dark:border-gray-800"
          :ui="{
            active: 'text-grey-900 after:bg-grey-900 ',
            base: 'px-4 hover:before:bg-transparent before:rounded-none',
          }" />
      </template>
    </PageTitle>

    <Suspense>
      <UContainer class="pt-4">
        <NuxtPage />
      </UContainer>
      <template #fallback>
        <UContainer>
          <CommonLoader />
        </UContainer>
      </template>
    </Suspense>
  </section>
</template>

<script setup lang="ts">
  const configLinks = [
    {
      label: 'Governance',
      to: '/config/governance',
    },
    {
      label: 'Protocol',
      to: '/config/protocol',
    },
    {
      label: 'Guidance',
      to: '/config/guidance',
    },
  ]
</script>
