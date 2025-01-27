<template>
  <section>
    <PageTitle>
      <template #title>Configs</template>
      <template #bottom-left>
        <UHorizontalNavigation :links="configLinks" />
      </template>
    </PageTitle>

    <Suspense>
      <UContainer class="py-4">
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
    label: "Governance",
    to: "/config/governance",
  },
  {
    label: "Protocol",
    to: "/config/protocol",
  },
  {
    label: "Guidance",
    to: "/config/guidance",
  },
];
</script>
