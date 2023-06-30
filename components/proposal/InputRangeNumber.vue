<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <input
      v-model="from"
      class="input"
      type="number"
      placeholder="From"
      data-test="proposalValue"
    />

    <input
      v-model="to"
      class="input"
      type="number"
      placeholder="To"
      data-test="proposalValue2"
    />
    <div v-show="props.currentFrom && props.currentTo" class="w-1/2 uppercase">
      current: {{ props.currentFrom }} - {{ props.currentTo }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface InputProps {
  currentFrom: string;
  currentTo: string;
  modelValue: number;
  modelValue2: number;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const from = useVModelWrapper<InputProps>(props, emit, "modelValue");
const to = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>
