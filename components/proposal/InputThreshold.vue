<template>
  <div class="flex">
    <input
      v-bind="$attrs"
      v-model="value"
      v-maska:[mask]
      :class="{ error: hasErrors }"
      data-test="proposalValue"
      class="input"
    />
    <span
      class="inline-flex items-center px-3 bg-secondary-dark border border-l-0 border-grey-600"
    >
      <div class="text-gray-400 text-2xl">%</div>
    </span>
  </div>
  <p
    v-for="error of props.modelValueErrors"
    :key="error.$uid"
    class="text-red-500 text-xs my-2"
  >
    {{ error.$message }}
  </p>

  <div v-show="props.currentValue" class="text-xs text-grey-400 my-2">
    Current: {{ props.currentValue }}
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  currentValue: string;
  modelValue: any;
  modelValueErrors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModelWrapper<InputProps>(props, emit, "modelValue");
const hasErrors = computed(() => props.modelValueErrors?.length);

const mask = {
  mask: "##.##",
};
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
