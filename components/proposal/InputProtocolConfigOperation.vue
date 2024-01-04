<template>
  <div class="w-full">
    <SelectProtocolConfig
      v-model="key"
      class="mb-6"
      :errors="props.modelValueErrors"
    />

    <div>
      <label for="protocol-config-input">Value *</label>
      <MInput
        id="protocol-config-input"
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
