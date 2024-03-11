<template>
  <InputDynamic
    v-model="value"
    :model-value-errors="modelValueErrors"
    :current-value="currentValue"
    :maska="masks.eth"
    description="Update the fee charged for submitting proposals."
    data-test="proposalValue"
  />
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import InputDynamic from "./InputDynamic.vue";
import { masks } from "@/utils/masks";

export interface InputProps {
  currentValue?: string;
  modelValue: any;
  modelValueErrors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModelWrapper<InputProps>(props, emit, "modelValue");
</script>
