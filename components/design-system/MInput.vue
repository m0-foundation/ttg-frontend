<template>
  <UInput
    v-bind="$attrs"
    v-model="value"
    :class="{ error: hasErrors }"
    size="lg"
  />

  <div class="text-red-500 text-xs my-1 h-4 font-inter">
    <p v-for="error of props.errors" :key="error.$uid">
      {{ error.$message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  errors?: ErrorObject[];
  modelValue: any;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModelWrapper<InputProps>(props, emit, "modelValue");
const hasErrors = computed(() => props.errors?.length);
</script>

<style scoped>
.error {
  @apply bg-transparent border border-red-600;
}
</style>
