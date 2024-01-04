<template>
  <div class="w-full">
    <div>
      <label>Configuration parameter *</label>
      <SelectGovernanceConfig v-model="key" :errors="props.modelValueErrors" />
    </div>

    <div
      v-show="key?.description || key?.shortDescription"
      class="bg-green-1000 flex flex-col gap-3 p-4 mb-6"
    >
      <span class="uppercase text-xxs">Parameter description</span>
      <p class="font-inter">{{ key?.description || key?.shortDescription }}</p>
    </div>

    <div>
      <label for="governance-config-input">Value *</label>
      <MInput
        id="governance-config-input"
        v-model="value"
        class="input"
        type="text"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import { MVotingTokens } from "@/lib/api";

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const key = useVModelWrapper<InputProps>(props, emit, "modelValue");
const value = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
