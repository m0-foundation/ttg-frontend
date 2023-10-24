<template>
  <textarea v-bind="$attrs" v-model="value" :class="{ error: hasErrors }" />
  <p
    v-for="error of props.errors"
    :key="error.$uid"
    class="text-red text-xs my-2"
  >
    {{ error.$message }}
  </p>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  errors?: ErrorObject[];
  modelValue: string;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);
const value = useVModelWrapper<InputProps>(props, emit, "modelValue");
const hasErrors = computed(() => props.errors?.length);
</script>

<style>
.error {
  @apply border border-red;
}
</style>
