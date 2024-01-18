<template>
  <div class="w-full">
    <SelectGovernanceConfig
      v-model="key"
      class="mb-6"
      @handle-change-list="handleChangeList"
    />

    <div>
      <label for="governance-config-input">Value *</label>

      <component
        :is="inputs[selectedInput].component"
        v-if="inputs[selectedInput]"
        v-bind="inputs[selectedInput].props"
        id="governance-config-input"
        v-model="value1"
        v-model:modelValue2="value2"
        :model-value-errors="props.modelValueErrors"
        :model-value2-errors="props.modelValue2Errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import InputDynamic from "./InputDynamic.vue";
import InputDynamicDoubleModel from "./InputDynamicDoubleModel.vue";

import { masks } from "@/utils/masks";

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const key = ref();

const value1 = useVModelWrapper<InputProps>(props, emit, "modelValue");
const value2 = useVModelWrapper<InputProps>(props, emit, "modelValue2");

const inputs = {
  setProposalFee: {
    component: InputDynamic,
    props: {
      decorator: "WETH",
      maska: masks.eth,
    },
  },

  setCashToken: {
    component: InputDynamicDoubleModel,
    props: {
      input1: {
        decorator: "Address",
        maska: masks.ethereumAddress,
      },
      input2: {
        decorator: "WETH",
        maska: masks.eth,
      },
    },
  },

  setZeroProposalThresholdRatio: {
    component: InputDynamic,
    props: {
      decorator: "%",
      maska: masks.percentage,
    },
  },
  setEmergencyProposalThresholdRatio: {
    component: InputDynamic,
    props: {
      decorator: "%",
      maska: masks.percentage,
    },
  },
};

const selectedInput = computed(() => key.value);

function handleChangeList() {
  console.log("handleChangeList");
  value1.value = undefined;
  value2.value = undefined;
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
