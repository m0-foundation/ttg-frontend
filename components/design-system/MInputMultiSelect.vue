<template>
  <div ref="target" class="dropdown inline-block relative w-full">
    <button
      type="button"
      class="bg-transparent border border-1-white text-white py-2 px-4 inline-flex justify-between w-full"
      @click="onOpen"
    >
      {{ selected?.label || "Select a proposal type" }}
      <span class="text-xs text-[#5d605d]">change</span>
    </button>
    <ul v-show="isMenuOpen" class="absolute text-white pt-1 bg-grey-secondary">
      <li v-for="opt in options" :key="opt.value">
        <button
          v-if="opt.children"
          type="button"
          class="button"
          @click="onShowSubmenu(opt)"
        >
          {{ opt.label }} &rsaquo;
        </button>

        <button v-else type="button" class="button" @click="onSelect(opt)">
          {{ opt.label }}
        </button>

        <ul v-show="isSubmenuOpen(opt)" class="sub-menu">
          <li v-for="child in opt.children" :key="child.value">
            <button
              type="button"
              class="button sub-button"
              @click="onSelect(child)"
            >
              {{ child.label }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";

export interface OptionItem {
  value: string;
  label: string;
  children?: Array<{ value: string; label: string }>;
}

export interface Props {
  options: Array<OptionItem>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "on-change", option: OptionItem): void;
}>();

const target = ref(null);
const isMenuOpen = ref(false);
const selectedSubmenu = ref<object>({});
const selected = ref();

function onSelect(option: OptionItem) {
  selected.value = option;
  emit("on-change", option);
  onOut();
}

function onOpen() {
  isMenuOpen.value = !isMenuOpen.value;
}

function onOut() {
  isMenuOpen.value = false;
  selectedSubmenu.value = {};
}

function onShowSubmenu(opt: OptionItem) {
  selectedSubmenu.value = {}; // only one submenu can be open at a time
  selectedSubmenu.value = { ...selectedSubmenu.value, [opt.value]: true };
}

function isSubmenuOpen(opt: OptionItem) {
  return selectedSubmenu.value[opt.value as keyof typeof selectedSubmenu.value];
}

onClickOutside(target, onOut);
</script>
<style scoped>
.button {
  @apply text-left w-full hover:bg-[#202220] py-2 px-4 block whitespace-nowrap;
}

.sub-button {
  @apply hover:bg-[#202220];
}

.sub-menu {
  @apply bg-[#2a2d2a] absolute block text-white left-full -mt-10;
}
</style>
