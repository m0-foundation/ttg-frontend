<template>
  <label
    class="flex gap-1 items-center justify-center h-9 w-full lg:w-min uppercase px-6"
    :class="{
      'bg-green-400 text-neutral-900': isChecked,
      'bg-neutral-700 text-gray-200': !isChecked && !attrs.disabled,
      'bg-opacity-20 border border-none text-slate-500':
        isChecked && attrs.disabled,
      'border border-zinc-500 text-zinc-500 opacity-30':
        !isChecked && attrs.disabled,
    }"
  >
    <div class="w-3 h-3 relative">
      <div
        class="w-3 h-3 left-0 top-0 absolute rounded-full border"
        :class="{
          'border-gray-900': isChecked && !attrs.disabled,
          'border-slate-500': isChecked && attrs.disabled,
          'bg-zinc-500 border-none': !isChecked && attrs.disabled,
        }"
      ></div>
      <div
        v-if="isChecked"
        class="w-1.5 h-1.5 left-[3px] top-[3px] absolute rounded-full border"
        :class="{
          'bg-neutral-900 border-neutral-900': isChecked && !attrs.disabled,
          'bg-slate-500 border-none': isChecked && attrs.disabled,
          'bg-zinc-500': !isChecked && attrs.disabled,
        }"
      ></div>
    </div>
    <span class="text-xs mb-[-3px] whitespace-nowrap"> {{ text }} </span>
    <input
      v-bind="$attrs"
      v-model.number="value"
      type="radio"
      class="hidden"
      @click="emits('click', $event)"
    />
  </label>
</template>

<script lang="ts" setup>
export interface MButtonRadioProps {
  modelValue: number | null;
  text: string;
}

const emits = defineEmits(["update:modelValue", "click"]);
const attrs = useAttrs();
const props = withDefaults(defineProps<MButtonRadioProps>(), {
  modelValue: null,
  text: "",
});

const value = computed({
  get: () => props.modelValue,
  set: (val) => emits("update:modelValue", val),
});

const isChecked = computed(() => props?.modelValue === attrs?.value);
</script>
