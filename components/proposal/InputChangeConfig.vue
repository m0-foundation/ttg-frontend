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
      v-model="address"
      class="input"
      type="text"
      placeholder="Config Address"
      data-test="proposalValue2"
    />

    <input
      v-model="interfaceId"
      name="proposalValue3"
      type="text"
      placeholder="Interface ID"
      data-test="proposalValue3"
    />
  </div>
</template>

<script setup lang="ts">
export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValue3: string;
}

const props = defineProps<InputProps>();
const emit = defineEmits([
  "update:modelValue",
  "update:modelValue2",
  "update:modelValue3",
]);

const name = useVModelWrapper<InputProps>(props, emit, "modelValue");
const address = useVModelWrapper<InputProps>(props, emit, "modelValue2");
const interfaceId = useVModelWrapper<InputProps>(props, emit, "modelValue3");
</script>
