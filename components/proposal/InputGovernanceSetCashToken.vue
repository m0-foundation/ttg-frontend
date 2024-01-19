<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <InputDynamic
        v-model="address"
        :model-value-errors="modelValueErrors"
        :maska="masks.ethereumAddress"
        description="Update the currency used for payment when submitting proposal"
        placeholder="Token Address"
        data-test="proposalValue"
      />
    </div>

    <div class="block w-1/2">
      <InputDynamic
        v-model="fee"
        :model-value-errors="modelValue2Errors"
        :maska="masks.eth"
        description="Update the fee charged for submitting proposals based on the new Token."
        placeholder="New Proposal Fee"
        data-test="proposalValue2"
        decorator="WETH"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import { masks } from "@/utils/masks";

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
</script>

<style scoped>
.error {
  @apply border border-red-500;
}

.error--message {
  @apply text-red-500 text-xs my-2 h-4;
}
</style>
