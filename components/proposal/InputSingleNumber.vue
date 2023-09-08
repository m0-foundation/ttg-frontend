<template>
  <div class="block">
    <MInput
      v-model="value"
      class="input"
      type="number"
      data-test="proposalValue"
      :errors="props.modelValueErrors"
    />
  </div>
  <div v-show="props.currentValue" class="w-1/2 uppercase">
    current: {{ props.currentValue }}
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface ProposalInputProps {
  currentValue: string;
  modelValue: number;
  modelValueErrors?: ErrorObject[];
}

const props = defineProps<ProposalInputProps>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModelWrapper<ProposalInputProps>(props, emit, "modelValue");
</script>
