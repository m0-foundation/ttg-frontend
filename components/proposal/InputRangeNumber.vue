<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <MInput
        v-model="from"
        class="input"
        type="number"
        placeholder="From"
        data-test="proposalValue"
        :errors="props.modelValueErrors"
      />
    </div>
    <div class="block w-1/2">
      <MInput
        v-model="to"
        class="input"
        type="number"
        placeholder="To"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
      />
    </div>
  </div>

  <div v-show="props.currentFrom && props.currentTo" class="w-1/2 uppercase">
    current: {{ props.currentFrom }} - {{ props.currentTo }}
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  currentFrom: string;
  currentTo: string;
  modelValue: number;
  modelValue2: number;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const from = useVModelWrapper<InputProps>(props, emit, "modelValue");
const to = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>
