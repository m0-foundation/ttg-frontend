<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <input
      v-model="name"
      class="input"
      type="text"
      placeholder="Config Name"
      data-test="proposalValue"
    />

    <input
      v-model="value"
      class="input"
      type="text"
      placeholder="Config Value"
      data-test="proposalValue2"
    />
  </div>
</template>

<script setup lang="ts">
export interface InputProps {
  modelValue: string;
  modelValue2: string;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const name = useVModelWrapper<InputProps>(props, emit, "modelValue");
const value = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>
