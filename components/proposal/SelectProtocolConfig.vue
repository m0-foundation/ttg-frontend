<template>
  <div>
    <div v-if="customConfig" class="flex">
      <button
        class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
        data-test="create-proposal-button-close-other-config"
        @click="customConfig = false"
      >
        X
      </button>

      <input
        v-model="list"
        :class="{ input: true, error: hasErrors }"
        data-test="proposalValue"
        placeholder="Custom parameter name"
        type="text"
      />
    </div>

    <div v-else>
      <MInputMultiSelect
        :options="configParams"
        label="Select configuration parameter"
        data-test="protocolConfigSelect"
        @on-change="handleChangeList"
      />
    </div>

    <div v-if="props.errors.length > 0" class="text-red-500 text-xs my-2 h-4">
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

const customConfig = ref(false);

const configParams = [
  {
    header: "protocol",
  },
  {
    value: "updateCollateral_interval",
    label: "Update collateral interval",
    shortDescription:
      "Update the period of time between which Update Collateral must be called by a Minter.",
    description:
      "The length of time in seconds that Minter has to call updateCollateral, from the previous time it was called by that minter, before they will incur the penalty.",
  },
  {
    value: "updateCollateral_threshold",
    label: "Update collateral threshold",
    shortDescription:
      "Update the minimum number of signatures required to execute Update Collateral.",
  },
  {
    value: "penalty_rate",
    label: "Penalty rate",
    shortDescription:
      "Update the fee charged on Owed M that in case of insufficient reserve.",
  },
  {
    header: "mint",
  },
  {
    value: "mint_delay",
    label: "Mint delay",
    shortDescription:
      "Update the amount of time between when a Minter has called Propose Mint and when they can call Mint M.",
  },
  {
    value: "mint_ttl",
    label: "Mint TTL",
    shortDescription: "Placeholder",
  },
  {
    value: "mint_ratio",
    label: "Mint ratio",
    shortDescription:
      "Update the fraction size of a Minter’s on-chain Collateral Value that they can generate in M.",
  },
  {
    value: "minter_freeze_time",
    label: "Propose mint time to live",
    shortDescription:
      "Update the amount of time that Mint has to be called before Propose Mint expires.",
  },
  {
    header: "interest rates",
  },
  {
    value: "minter_rate_model",
    label: "Minter rate",
    shortDescription:
      "Update the annualized percentage charged to Minters on their Owed M.",
  },
  {
    value: "earner_rate_model",
    label: "Earner rate",
    shortDescription:
      "Update the annualized percentage paid to M in the Earn Mechanism.",
  },
  {
    value: "custom_parameter",
    label: "Create new parameter",
  },
];

function handleChangeList(e: any) {
  if (e?.value === "custom_parameter") {
    list.value = "";
    customConfig.value = true;
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
