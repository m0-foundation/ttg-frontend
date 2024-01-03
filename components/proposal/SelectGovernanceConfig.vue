<template>
  <div>
    <div v-if="isOther" class="flex">
      <button
        class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
        data-test="create-proposal-button-close-other-config"
        @click="isOther = false"
      >
        X
      </button>

      <input
        v-model="list"
        :class="{ input: true, error: hasErrors }"
        data-test="proposalValue"
        placeholder="My other config"
        type="text"
      />
    </div>

    <div v-else>
      <MInputMultiSelect
        :options="configParams"
        label="Select configuration parameter"
        @on-change="handleChangeList"
      />
    </div>

    <div class="text-red-500 text-xs my-2 h-4">
      <p v-for="error of props.errors" :key="error.$uid">
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  modelValue: string;
  errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");

const hasErrors = computed(() => props.errors?.length);

const isOther = ref(false);

const configParams = [
  {
    value: "setProposalFee",
    label: "Proposal Fee",
    shortDescription: "Update the fee charged for submitting proposals.",
  },
  {
    value: "setCashToken",
    label: "Cash Token",
    shortDescription: "Update the currency used for payment in auctions.",
  },
  {
    value: "setZeroProposalThresholdRatio",
    label: "ZERO Threshold",
    shortDescription:
      "Update the number of yes votes required to pass Zero proposals.",
  },
  {
    value: "setEmergencyProposalThresholdRatio",
    label: "Power Threshold",
    shortDescription:
      "Update the number of yes votes required to pass Power proposals.",
  },
];

function handleChangeList(e: any) {
  if (e.target?.value === "other") {
    list.value = "";
    isOther.value = true;
  } else {
    list.value = e;
  }
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
