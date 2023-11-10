<template>
  <div class="block">
    <input
      v-model="fee"
      v-maska:[maskEth]
      :class="{ error: hasErrors }"
      data-test="proposalValue"
      class="input"
      placeholder="From"
    />

    <p
      v-for="error of props.modelValueErrors"
      :key="error.$uid"
      class="error--message"
    >
      {{ error.$message }}
    </p>
  </div>

  <div v-if="props.currentValue" class="text-xs text-grey-400 my-2">
    Current: {{ props.currentValue }}
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  currentValue: string;
  modelValue: number;
  modelValueErrors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);
const fee = useVModelWrapper<InputProps>(props, emit, "modelValue");
const hasErrors = computed(() => props.modelValueErrors?.length);

const maskEth = {
  mask: "99999999999999999#.999999999999999999",
  tokens: "9:[0-9]:optional",
};
</script>

<style scoped>
.error {
  @apply border border-red-500;
}

.error--message {
  @apply text-red-500 text-xs my-2 h-4;
}
</style>
