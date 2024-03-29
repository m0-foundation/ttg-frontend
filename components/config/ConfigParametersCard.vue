<template>
  <div class="flex flex-col gap-4 bg-grey-800 p-8">
    <div class="flex gap-4 justify-between">
      <div>
        <h3 class="text-xl">{{ param?.title }}</h3>
        <div class="config-key-badge">{{ param?.key }}</div>
      </div>
      <div class="flex gap-4">
        <div class="text-end">
          <p class="text-2xl font-bold">
            {{ formattedValue(param) }}
          </p>
          <p class="config-key-badge">{{ param?.value }}</p>
        </div>
        <MDropdown v-if="param?.proposal?.executedEvent" origin="right">
          <ul class="dropdown-menu-items">
            <li
              class="px-6 py-3 text-xxs text-grey-500 border-b border-b-grey-800"
            >
              <p>Last updated</p>
              <p>
                {{
                  useDate(param?.proposal?.executedEvent?.timestamp).toFormat(
                    "LLL"
                  )
                }}
              </p>
            </li>
            <li>
              <NuxtLink :to="`/proposal/${param?.proposal?.proposalId}`"
                >Show proposal
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/proposal/create"> Create new proposal </NuxtLink>
            </li>
            <li></li>
          </ul>
        </MDropdown>
      </div>
    </div>
    <div
      v-if="param?.docs || param?.description"
      class="font-inter text-grey-500"
    >
      <p>
        {{ param?.description }}
      </p>
      <a
        v-if="param?.docs"
        :href="param?.docs"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm underline mt-2"
        >Learn more</a
      >
    </div>
  </div>
</template>
<script setup>
import { formatUnits } from "viem";

const { currentCashToken } = storeToRefs(useSpogStore());

defineProps({
  param: Object,
  default: () => {},
});

const formattedValue = (param) => {
  if (!param) return;
  if (param.key === "cashToken") {
    return currentCashToken?.value?.symbol;
  } else if (param.type === "decimals") {
    return formatUnits(BigInt(param.value), 18);
  } else if (param.type === "basisPoints") {
    return `${basisPointsToPercentage(param.value)}%`;
  } else if (param.type === "address") {
    return shortenAddress(param.value);
  }
  return param.value;
};
</script>
