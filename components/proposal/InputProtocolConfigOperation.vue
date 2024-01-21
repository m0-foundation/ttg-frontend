<template>
  <div class="w-full">
    <SelectProtocolConfig
      v-model="key"
      class="mb-6"
      :errors="props.modelValueErrors"
    />

    <div>
      <component
        :is="inputs[selectedInput].component"
        v-if="inputs[selectedInput]"
        v-bind="inputs[selectedInput].props"
        id="protocol-config-input"
        v-model="value"
        class="input"
        type="text"
        data-test="proposalValue2"
        :model-value-errors="props.modelValue2Errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import InputDynamic from "./InputDynamic.vue";
import { masks } from "@/utils/masks";

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const inputs = {
  update_collateral_interval: {
    component: InputDynamic,
    props: {
      decorator: "seconds",
      maska: masks.seconds,
    },
  },

  update_collateral_threshold: {
    component: InputDynamic,
    props: {
      maska: masks.interger,
    },
  },

  penalty_rate: {
    component: InputDynamic,
    props: {
      decorator: "%",
      maska: masks.percentage,
    },
  },

  mint_delay: {
    component: InputDynamic,
    props: {
      decorator: "seconds",
      maska: masks.seconds,
    },
  },

  mint_ttl: {
    component: InputDynamic,
    props: {
      decorator: "seconds",
      maska: masks.seconds,
    },
  },

  mint_ratio: {
    component: InputDynamic,
    props: {
      decorator: "%",
      maska: masks.percentage,
    },
  },

  minter_freeze_time: {
    component: InputDynamic,
    props: {
      decorator: "seconds",
      maska: masks.seconds,
    },
  },

  minter_rate_model: {
    component: InputDynamic,
    props: {
      decorator: "address",
      maska: masks.ethereumAddress,
    },
  },

  earner_rate_model: {
    component: InputDynamic,
    props: {
      decorator: "address",
      maska: masks.ethereumAddress,
    },
  },
};

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const key = useVModelWrapper<InputProps>(props, emit, "modelValue");
const value = useVModelWrapper<InputProps>(props, emit, "modelValue2");

const selectedInput = computed(() => key.value);
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
