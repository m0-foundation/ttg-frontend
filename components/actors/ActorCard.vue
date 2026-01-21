<template>
  <CommonCard
    class="flex flex-col justify-between gap-4 font-inter shadow-none p-4">
    <div>
      <div class="h-[40px] mb-8 flex items-center">
        <img
          :src="`/img/actors/${props.cardImage ? props.cardImage : 'NoActor.svg'}`"
          :alt="`${title}`"
          class="max-h-[40px] max-w-[240px]" />

        <!-- 
      <h4 v-if="title" class="text-xl font-semibold font-inter">
        {{ title }}
      </h4>
      --></div>
      <p class="text-base text-gray-500 py-4">
        {{ description }}
      </p>
    </div>
    <div class="text-xs flex items-center gap-4">
      <div class="text-xs">
        <p class="text-gray-500">
          <MAddressCopy
            :address="account"
            :shortAddress="true"
            :showAvatar="true" />
        </p>
      </div>
      <div class="flex text-xs">
        <div class="flex">
          <p class="text-gray-500">
            <NuxtLink
              :to="`/proposal/${props.proposalId}`"
              class="underline text-gray-500">
              Added
              {{ timestamp ? useDate(timestamp).toFormat('DD MMM YYYY') : '-' }}
            </NuxtLink>
          </p>
        </div>
      </div>

      <NuxtLink
        v-if="website"
        :to="`http://${website}`"
        class="text-gray-500 font-normal underline"
        target="_blank">
        Website
      </NuxtLink>
    </div>
  </CommonCard>
</template>

<script setup lang="ts">
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    account: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Number,
      default: 0,
    },
    website: {
      type: String,
      default: '',
    },
    proposalId: {
      type: String,
      default: '',
    },
    cardImage: {
      type: String,
      default: '',
    },
  })
</script>
