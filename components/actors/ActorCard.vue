<template>
  <UCard class="flex flex-col gap-4 max-w-xl font-inter mb-4">
    <div class="flex gap-4">
      <UCard
        class="w-36 h-36 flex items-center justify-center border-0 ring-0 shadow-none">
        <img
          :src="`/img/actors/${props.cardImage ? props.cardImage : 'NoActor.svg'}`"
          :alt="`${title} logo`" />
      </UCard>
      <div>
        <h4 v-if="title" class="text-lg font-semibold pb-2">
          {{ title }}
        </h4>
        <h2 v-else class="text-lg font-semibold pb-2">
          <MAddressAvatar
            :short-address="true"
            :showAvatar="false"
            :address="account" />
        </h2>
        <div class="flex gap-4 pb-4 flex-wrap">
          <div class="text-xs">
            <span class="text-gray-500">Address:</span>
            <p class="text-gray-900 font-medium">
              <MAddressAvatar
                :short-address="true"
                :showAvatar="false"
                :address="account" />
            </p>
          </div>
          <div class="text-xs">
            <span class="text-gray-500">Added:</span>
            <div class="flex">
              <p class="text-gray-900 font-medium">
                {{
                  timestamp ? useDate(timestamp).toFormat('DD MMM YYYY') : '-'
                }}
                ·
              </p>
              <NuxtLink
                :to="`/proposal/${props.proposalId}`"
                class="underline text-gray-900 ml-1">
                Show proposal
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="text-xs" v-if="website">
          <div class="text-gray-500">Website:</div>
          <NuxtLink
            :to="`http://${website}`"
            class="text-gray-900 font-bold underline"
            target="_blank"
            >{{ website }}</NuxtLink
          >
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-900 py-4">
      {{ description }}
    </p>
  </UCard>
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
