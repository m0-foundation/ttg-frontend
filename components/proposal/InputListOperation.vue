<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <MInput
        v-model="list"
        class="input"
        type="text"
        placeholder="List"
        data-test="proposalValue"
        :errors="props.modelValueErrors"
      />
    </div>

    <div class="block w-1/2">
      <MInput
        v-model="address"
        class="input"
        type="text"
        placeholder="Address"
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

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");
const address = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>
