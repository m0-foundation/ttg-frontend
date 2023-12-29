<template>
  <div class="flex-col gap-3">
    <label>List</label>

    <div class="block">
      <SelectList v-model="list" :errors="props.modelValueErrors" />
    </div>

    <div class="block w-full">
      <MInput
        v-model="address"
        class="input"
        type="text"
        placeholder="Address"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
        data-1p-ignore
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

const options = ["minters", "validators", "earners"];

export interface InputProps {
  modelValue: string;
  modelValue2: string;
  modelValueErrors?: ErrorObject[];
  modelValue2Errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue", "update:modelValue2"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");
const address = useVModelWrapper<InputProps>(props, emit, "modelValue2");

const hasErrors = computed(() => props.modelValueErrors?.length);

const isOtherList = ref(false);

function handleChangeList(e: any) {
  if (e.target.value === "otherList") {
    list.value = "";
    isOtherList.value = true;
  }
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
