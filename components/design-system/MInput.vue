<template>
  <input v-bind="$attrs" :class="{ error: hasErrors }" />
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
}

const props = defineProps<InputProps>();

const hasErrors = computed(() => props.errors?.length);
</script>

<style>
.error {
  @apply border border-red;
}
</style>
