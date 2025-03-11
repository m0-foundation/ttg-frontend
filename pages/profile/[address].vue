<template>
  <section v-if="address">
    <PageTitle>
      <template #pretitle>
        <div>Profile /</div>
      </template>
      <template #title>
        <MAddressAvatar
          class="normal-case"
          :short-address="true"
          :address="address"
          :show-avatar="false"
          :link="false" />
      </template>
    </PageTitle>

    <UContainer class="py-4">
      <ProfileBalances :address="address" />
      <!-- tables -->
      <ProfileTables :address="address" />
    </UContainer>
  </section>
  <div
    v-else
    class="flex flex-col items-center justify-center h-80 text-grey-400">
    User not found
  </div>
</template>

<script setup lang="ts">
  import { Hash } from 'viem'

  const route = useRoute()
  const address = ref(route.params.address as Hash)

  useHead({
    titleTemplate: `%s - Profile ${shortenAddress(address.value)}`,
  })
</script>
