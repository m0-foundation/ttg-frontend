<template>
  <div>
    <div v-if="isOtherList" class="flex">
      <button
        class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
        data-test="create-proposal-button-close-other-list"
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
      <p v-for="error of props.errors" :key="error.$uid">
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorObject } from "@vuelidate/core";

const options = ["minters", "validators", "earners"];

export interface InputProps {
  modelValue: string;
  errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");

const hasErrors = computed(() => props.errors?.length);

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
