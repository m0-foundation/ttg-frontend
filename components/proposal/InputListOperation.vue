<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <input
      v-model="list"
      class="input"
      type="text"
      placeholder="List"
      data-test="proposalValue"
    />

    <input
      v-model="address"
      class="input"
      type="text"
      placeholder="Address"
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

const address = useVModelWrapper<InputProps>(props, emit, "modelValue");
const list = useVModelWrapper<InputProps>(props, emit, "modelValue2");
</script>
