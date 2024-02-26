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
</script>

<template>
  <MdEditor v-model="value" language="en-US" theme="dark" />
</template>
