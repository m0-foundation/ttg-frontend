<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/3">
      <SelectList v-model="list" :errors="props.modelValueErrors" />
    </div>

    <div class="block w-1/3">
      <MInput
        v-model="remove"
        class="input"
        type="text"
        placeholder="Remove address"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
      />
    </div>

    <div class="block w-1/3">
      <MInput
        v-model="add"
        class="input"
        type="text"
        placeholder="Add address"
        data-test="proposalValue3"
        :errors="props.modelValue3Errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValue3: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
  modelValue3Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits([
  "update:modelValue",
  "update:modelValue2",
  "update:modelValue3",
]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");
const remove = useVModelWrapper<InputProps>(props, emit, "modelValue2");
const add = useVModelWrapper<InputProps>(props, emit, "modelValue3");
</script>
