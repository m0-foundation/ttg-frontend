<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <input
      v-model="value"
      class="input"
      type="number"
      data-test="proposalValue"
    />
    <div v-show="props.currentValue" class="w-1/2 uppercase">
      current: {{ props.currentValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ProposalInputProps {
  currentValue: string;
  modelValue: number;
}

const props = defineProps<ProposalInputProps>();
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
