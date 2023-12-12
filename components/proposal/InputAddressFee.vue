<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <MInput
        v-model="address"
        class="input"
        type="text"
        placeholder="Address"
        data-test="proposalValue"
        :errors="props.modelValueErrors"
      />
    </div>

    <div class="block w-1/2">
      <input
        v-model="fee"
        v-maska:[maskEth]
        :class="{ error: hasErrorsFee }"
        data-test="proposalValue2"
        class="input"
        placeholder="From"
      />

      <div class="error--message">
        <p v-for="error of props.modelValue2Errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

export interface InputProps {
  modelValue: string;
  modelValue2: number;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const address = useVModelWrapper<InputProps>(props, emit, "modelValue");
const fee = useVModelWrapper<InputProps>(props, emit, "modelValue2");
const hasErrorsFee = computed(() => props.modelValue2Errors?.length);

const maskEth = {
  mask: "999999999999999999.999999999999999999",
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
