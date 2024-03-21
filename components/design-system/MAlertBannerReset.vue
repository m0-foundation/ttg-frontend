<template>
  <div class="items-stretch bg-red-700 flex flex-col px-4">
    <div
      class="text-gray-200 text-xs leading-3 uppercase whitespace-nowrap mt-5 max-md:max-w-full"
    >
      global reset
    </div>
    <div
      class="flex justify-between gap-2 mt-4 mb-4 max-md:max-w-full max-md:flex-wrap"
    >
      <MIconAlert
        class="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
      />
      <div
        class="text-gray-200 text-base leading-6 self-stretch grow shrink basis-auto max-md:max-w-full"
      >
        <p class="font-bold mb-2">Reset of the Governance has been executed!</p>
        <span class="">
          New Power tokens are created and distributed pro rata to all existing
          (excluding inflation) Zero token holders.
        </span>
        <NuxtLink :to="`/proposal/${proposal.proposalId}`">
          <MButton
            version="outline-light"
            class="my-2"
            data-test="reset-alert-button-view-proposal"
          >
            view proposal
          </MButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MProposal } from "@/lib/api/types";

export interface Props {
  proposal: MProposal;
}

defineProps<Props>();
</script>
