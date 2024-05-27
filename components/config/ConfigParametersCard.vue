<template>
  <div class="flex flex-col gap-4 bg-grey-800 p-4 lg:p-6">
    <div class="flex gap-4 justify-between">
      <div>
        <h3 class="text-xl">{{ param?.title }}</h3>
        <div class="config-key-badge">{{ param?.key }}</div>
      </div>
      <div class="flex gap-4">
        <div class="text-end">
          <p class="lg:text-2xl font-bold">
            {{ formattedValue(param) }}
          </p>
          <div class="config-key-badge">
            <div v-if="param?.value" class="flex align-center">
              <span>{{ shortenText(param.value) }} {{ param?.unit }}</span>
              <template v-if="param?.copyValue">
                <MIconSimpleCheck
                  v-if="isJustCopied"
                  class="min-w-4 h-4 fill-white"
                />
                <button v-if="!isJustCopied" @click="copy(param.value)">
                  <MIconCopy class="min-w-4 h-4 hover:opacity-75 fill-white" />
                </button>
              </template>
            </div>
            <span v-else class="text-nowrap">Parameter not set</span>
          </div>
        </div>
        <MDropdown v-if="param?.proposal?.executedEvent">
          <ul class="dropdown-menu-items">
            <li
              class="px-6 py-3 text-xxs text-grey-500 border-b border-b-grey-800"
            >
              <p>Last updated</p>
              <p>
                {{
                  useDate(param?.proposal?.executedEvent?.timestamp).toFormat(
                    "LLL",
                  )
                }}
              </p>
            </li>
            <li>
              <NuxtLink :to="`/proposal/${param?.proposal?.proposalId}`"
                >Show proposal
              </NuxtLink>
            </li>
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
import { shortenText } from "@/utils/misc";

const { currentCashToken } = storeToRefs(useTtgStore());
const { isJustCopied, copy } = useCopyClipboard();

defineProps({
  param: {
    type: Object,
    default: () => {},
  },
});

const formattedValue = (param) => {
  if (!param) return;
  if (param.key === "cashToken") {
    return currentCashToken?.value?.symbol;
  } else if (param.type === "decimals") {
    return formatUnits(BigInt(param.value), 18);
  } else if (param.type === "basisPoints") {
    return `${basisPointsToPercentage(param.value)}%`;
  } else if (param.type === "time") {
    return `${param.value >= 7200 ? param.value / 3600 + " hours" : param.value / 60 + " minutes"}`;
  } else if (param.type === "number") {
    return param.value;
  }
  return;
};
</script>
