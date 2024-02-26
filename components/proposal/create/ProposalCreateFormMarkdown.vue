<template>
  <div :class="{ 'border border-red-500': hasErrors }">
    <MdEditor v-model="value" language="en-US" theme="dark" />
  </div>

  <div class="text-red-500 text-xs my-2 h-4">
    <p v-for="error of props.errors" :key="error.$uid">
      {{ error.$message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { MdEditor } from "md-editor-v3";
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

<style>
.md-editor-dark {
  --md-bk-color: theme("colors.grey-800");
}
</style>
