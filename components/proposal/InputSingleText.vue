<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <input
      v-model="value"
      class="input"
      type="text"
      data-test="proposalValue"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
export interface InputProps {
  modelValue: string;
  placeholder: string;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
