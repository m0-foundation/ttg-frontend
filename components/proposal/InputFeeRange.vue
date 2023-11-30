<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/3">
      <input
        v-model="from"
        v-maska:[maskEth]
        :class="{ error: hasErrorsFrom }"
        data-test="proposalValue"
        class="input"
        placeholder="From"
      />

      <div class="error--message">
        <p v-for="error of props.modelValueErrors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
    </div>
    <div class="block w-1/3">
      <input
        v-model="to"
        v-maska:[maskEth]
        :class="{ error: hasErrorsTo }"
        data-test="proposalValue2"
        class="input"
        placeholder="To"
      />

      <div class="error--message">
        <p v-for="error of props.modelValue2Errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
    </div>
    <div class="block w-1/3">
      <input
        v-model="fee"
        v-maska:[maskEth]
        :class="{ error: hasErrorsFee }"
        data-test="proposalValue3"
        class="input"
        placeholder="New Fee"
      />

      <div class="error--message">
        <p v-for="error of props.modelValue3Errors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
    </div>
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
  modelValue2: number;
  modelValue3: number;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
  modelValue3Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits([
  "update:modelValue",
  "update:modelValue2",
  "update:modelValue3",
]);

const from = useVModelWrapper<InputProps>(props, emit, "modelValue");
const to = useVModelWrapper<InputProps>(props, emit, "modelValue2");
const fee = useVModelWrapper<InputProps>(props, emit, "modelValue3");

const hasErrorsFrom = computed(() => props.modelValueErrors?.length);
const hasErrorsTo = computed(() => props.modelValue2Errors?.length);
const hasErrorsFee = computed(() => props.modelValue3Errors?.length);

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
