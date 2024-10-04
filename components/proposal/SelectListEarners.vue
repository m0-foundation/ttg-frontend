<template>
  <div>
    <div>
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

const listStore = useListsStore();

const options = listStore.earners?.map((e) => ({
  value: e.account,
  label: e.account,
  id: `earner_${e.account}`,
}));

export interface InputProps {
  modelValue: string;
  errors?: ErrorObject[];
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const list = useVModelWrapper<InputProps>(props, emit, "modelValue");

const hasErrors = computed(() => props.errors?.length);

function handleChangeList(e: any) {
  list.value = e.value;
}
</script>

<style>
.error {
  @apply border border-red-500;
}
</style>
