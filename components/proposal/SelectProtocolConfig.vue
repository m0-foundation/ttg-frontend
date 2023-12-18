<template>
  <div>
    <div v-if="isOtherList" class="flex">
      <button
        class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
        @click="isOtherList = false"
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
      <select
        v-model="list"
        data-test="proposalValue"
        :class="{ error: hasErrors }"
        @change="handleChangeList"
      >
        <option disabled selected :value="null">Select config</option>
        <option disabled value="">General</option>
        <option v-for="option in generalOptions" :key="option" :value="option">
          {{ option }}
        </option>
        <option disabled value="">Mint</option>
        <option v-for="option in mintOptions" :key="option" :value="option">
          {{ option }}
        </option>
        <option disabled value="">Interest rates</option>
        <option v-for="option in interestOptions" :key="option" :value="option">
          {{ option }}
        </option>
        <option disabled value=""></option>
        <option value="otherList">Other config</option>
      </select>
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

const generalOptions = [
  "updateCollateral_interval",
  "updateCollateral_threshold",
  "penalty_rate",
];
const mintOptions = [
  "mint_delay",
  "mint_ttl",
  "mint_ratio",
  "minter_freeze_time",
];
// Interest rates - call rate()
const interestOptions = ["minter_rate_model", "earner_rate_model"];

export interface InputProps {
  modelValue: string;
  errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");

const hasErrors = computed(() => props.errors?.length);

const isOtherList = ref(false);

function handleChangeList(e: any) {
  if (e.target.value === "otherList") {
    list.value = "";
    isOtherList.value = true;
  }
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
