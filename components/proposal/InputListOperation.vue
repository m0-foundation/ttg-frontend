<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <div v-if="isOtherList" class="flex">
        <button
          class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
          @click="isOtherList = false"
        >
          X
        </button>

        <input
          v-model="list"
          :class="{ input: true, error: hasErrors }"
          data-test="proposalValue"
          placeholder="My other list"
          type="text"
        />
      </div>

      <div v-else>
        <select
          v-model="list"
          data-test="proposalValue"
          :class="{ error: hasErrors }"
          @change="handleChangeList"
        >
          <option disabled value="" selected>Select list</option>
          <option v-for="option in options" :key="option" :value="option">
            {{ option }}
          </option>
          <option disabled value=""></option>
          <option value="otherList">Other list</option>
        </select>
      </div>
      <div class="text-red-500 text-xs my-2 h-4">
        <p v-for="error of props.modelValueErrors" :key="error.$uid">
          {{ error.$message }}
        </p>
      </div>
    </div>

    <div class="block w-1/2">
      <MInput
        v-model="address"
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
