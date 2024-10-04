<template>
  <div class="flex-col gap-3">
    <div>
      <label>Earner*</label>
      <ProposalSelectListEarners
        v-model="list"
        data-test="earners-select"
        :errors="props.modelValueErrors"
      />
    </div>

    <div>
      <label>Claimant *</label>

      <MInput
        v-model="value"
        class="input"
        type="text"
        placeholder="Address"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";
import { encodeAbiParameters, keccak256, toBytes, bytesToHex } from "viem";

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const list = ref();
const key = useVModelWrapper<InputProps>(props, emit, "modelValue");
const value = useVModelWrapper<InputProps>(props, emit, "modelValue2");

watch(list, (value) => {
  console.log("watch(list", { value });

  key.value = keccak256(
    encodeAbiParameters(
      [{ type: "bytes32" }, { type: "address" }],
      [
        bytesToHex(toBytes("wm_claim_override_recipient", { size: 32 })),
        list.value,
      ],
    ),
  );
});
</script>
