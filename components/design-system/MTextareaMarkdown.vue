<template>
  <textarea
    id="easymde"
    v-bind="$attrs"
    :value="modelValue"
    :class="{ error: hasErrors }"
  />
  <p
    v-for="error of props.errors"
    :key="error.$uid"
    class="text-red text-xs my-2"
  >
    {{ error.$message }}
  </p>
</template>

<script setup lang="ts">
import * as EasyMDE from "easymde";
import { ErrorObject } from "@vuelidate/core";
import "@/node_modules/easymde/dist/easymde.min.css";

import { useAttrs } from "vue";

export interface InputProps {
  errors?: ErrorObject[];
  modelValue: string;
}

const props = defineProps<InputProps>();
const emit = defineEmits(["update:modelValue"]);

const hasErrors = computed(() => props.errors?.length);

const easymde = ref();

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const attrs = useAttrs();

onMounted(() => {
  const easyMDE = new EasyMDE({
    element: easymde.value,
    spellChecker: false,
    nativeSpellcheck: false,
  });

  easyMDE.codemirror.on("change", () => {
    inputValue.value = easyMDE.value();
  });

  const container = document.getElementsByClassName("CodeMirror");
  container[0].setAttribute("data-test", attrs.name as string);
});
</script>

<style>
.error {
  @apply border border-red;
}

.EasyMDEContainer .CodeMirror {
  @apply !bg-secondary-dark border border-grey-secondary text-gray-100;
}

.editor-toolbar {
  @apply border border-grey-secondary;
}

.editor-toolbar button.active,
.editor-toolbar button.active,
.editor-toolbar button:hover {
  @apply bg-secondary-dark;
}

.CodeMirror-selected {
  @apply !bg-primary;
}

.CodeMirror-focused {
  @apply !bg-primary-dark;
}

.CodeMirror-guttermarker {
  @apply !text-white;
}

.CodeMirror-cursor {
  @apply !border-l-white;
}
</style>
