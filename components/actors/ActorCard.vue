<template>
  <UCard class="flex flex-col gap-4 max-w-lg font-inter mb-4">
    <div class="flex gap-4">
      <UCard class="w-36 h-36 flex items-center justify-center"
        ><img :src="img" alt="img"
      /></UCard>
      <div>
        <h4 class="text-lg font-semibold pb-2">{{ title ? title : "-" }}</h4>
        <div class="flex gap-4 pb-4">
          <div class="text-xs">
            <span class="text-[#728DA5]">Address:</span>
            <p class="text-gray-900 font-bold">
              <MAddressAvatar
                :short-address="true"
                :showAvatar="false"
                :address="account"
              />
            </p>
          </div>
          <div class="text-xs">
            <span class="text-[#728DA5]">Added:</span>
            <p class="text-gray-900 font-bold">
              {{ timestamp ? useDate(timestamp).toFormat("DD.MM.YYYY") : "-" }}
            </p>
            <NuxtLink
              :to="`/proposal/${props.proposalId}`"
              class="underline text-gray-900"
              >Show proposal</NuxtLink
            >
          </div>
        </div>
        <div class="text-xs">
          <span class="text-[#728DA5]">Website:</span>
          <p class="text-gray-900 font-bold">{{ website ? website : "-" }}</p>
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-900 py-4">
      {{ description }}
    </p>
    <NuxtLink
      to="https://dashboard.m0.org/"
      v-if="isMinter"
      class="w-full text-sm flex items-center justify-center bg-[#E9F0F7] py-1"
    >
      Dashboard
    </NuxtLink>
  </UCard>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  account: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Number,
    default: 0,
  },
  website: {
    type: String,
    default: "",
  },
  isMinter: {
    type: Boolean,
    default: false,
  },
  proposalId: {
    type: String,
    default: "",
  },
  cardImage: {
    type: String,
    default: "",
  },
});

const img = computed(
  () => new URL(`../../assets/images/${props.cardImage}`, import.meta.url).href
);
</script>
