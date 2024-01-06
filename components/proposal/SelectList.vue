<template>
  <div>
    <div v-if="isCustomList" class="flex">
      <button
        class="input px-4 inline-flex items-center min-w-fit border border-e-0 border-gray-700 bg-gray-200 text-sm text-gray-500"
        data-test="create-proposal-button-close-other-list"
        @click="isCustomList = false"
      >
        X
      </button>

      <input
        v-model="list"
        :class="{ input: true, error: hasErrors }"
        data-test="proposalValue"
        placeholder="Custom list"
        type="text"
        data-1p-ignore
      />
    </div>

    <div v-else>
      <MInputMultiSelect
        v-model="list"
        :options="options"
        :class="{ error: hasErrors }"
        @on-change="handleChangeList"
      />
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

const options = [
  {
    value: "minters",
    label: "Minters",
    id: "list_minters",
  },
  {
    value: "validators",
    label: "Validators",
    id: "list_validators",
  },
  {
    value: "earners",
    label: "Earners",
    id: "list_earners",
  },
  {
    value: "custom",
    label: "Create new list",
    id: "list_custom",
  },
];

export interface InputProps {
  modelValue: string;
  errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");

const hasErrors = computed(() => props.errors?.length);

const isCustomList = ref(false);

function handleChangeList(e: any) {
  if (e.value === "custom") {
    list.value = "";
    isCustomList.value = true;
  } else {
    list.value = e.value;
  }
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
