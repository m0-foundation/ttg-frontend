<template>
  <div ref="target" class="dropdown inline-block relative w-full font-inter">
    <button
      type="button"
      class="border border-grey-700 bg-grey-800 py-2 px-4 flex justify-between w-full items-center font-inter"
      @click="onOpen"
    >
      <span class="h-6">{{ selected?.label || props.label || " " }}</span>
      <div class="flex items-center gap-3 h-full">
        <MBadge
          v-if="selected?.isEmergency || selected?.isReset"
          version="error"
          class="text-xxs"
          >{{ selected.isEmergency ? "Emergency" : "Reset" }} proposal</MBadge
        >

        <img src="/img/icons/arrow.svg" alt="arrow icon" />
      </div>
    </button>
    <ul
      v-show="isMenuOpen"
      class="absolute z-50 pt-4 bg-grey-800 shadow-grey-1000 shadow-md"
    >
      <li
        v-for="opt in options"
        :key="opt.value"
        :data-test="opt.id"
        class="min-w-[220px]"
      >
        <div
          v-show="opt.header"
          class="uppercase text-xs text-grey-600 px-4 py-2"
        >
          {{ opt.header }}
        </div>

        <div v-show="!opt.header" :class="[{ emergency: opt.isEmergency }]">
          <button
            v-if="opt.children"
            type="button"
            class="button"
            @click="onShowSubmenu(opt)"
          >
            {{ opt.label }} &rsaquo;
          </button>

          <button
            v-else
            type="button"
            class="flex justify-between items-center button gap-12 group"
            @click="onSelect(opt)"
          >
            <div class="flex flex-col">
              <span>{{ opt.label }}</span>
              <span class="text-xs text-grey-600 group-hover:text-grey-100">{{
                opt.shortDescription
              }}</span>
            </div>

            <div v-for="token in opt.tokens" :key="token">
              <MIconPower
                v-if="token === MVotingTokens.Power"
                class="w-[24px] h-[24px]"
              />
              <MIconZero
                v-if="token === MVotingTokens.Zero"
                class="w-[24px] h-[24px]"
              />
            </div>
          </button>

          <ul
            v-show="isSubmenuOpen(opt)"
            class="flex justify-between items-center sub-menu"
            :class="{ 'fix-when-emergency': opt.isEmergency }"
          >
            <li v-if="opt.submenuText" class="bg-red-700 p-4 text-xs">
              {{ opt.submenuText }}
            </li>
            <li v-for="child in opt.children" :key="child.value">
              <button
                type="button"
                class="flex justify-between items-center button sub-button"
                :data-test="child.id"
                @click="onSelect(child)"
              >
                <span class="mr-8">{{ child.label }}</span>
                <div class="flex">
                  <div v-for="token in child.tokens" :key="token">
                    <MIconPower v-if="token === MVotingTokens.Power" />
                    <MIconZero v-if="token === MVotingTokens.Zero" />
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { MVotingTokens } from "@/lib/api/types";

export interface OptionItem {
  value: string;
  label: string;
  component: any;
  description: string;
  id: string;
  shortDescription: string;
  tokens: string[];
  header?: string;
  isEmergency?: boolean;
  isReset?: boolean;
  children?: Array<{
    value: string;
    label: string;
    isEmergency: boolean;
    component: any;
    tokens: string[];
    id: string;
  }>;
  submenuText?: string;
}

export interface Props {
  options: Array<OptionItem>;
  label: string;
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
  @apply font-inter text-left w-full py-2 px-4 hover:bg-grey-600;
}

.sub-button {
  @apply hover:bg-grey-600 px-4 py-2;
}

.sub-menu {
  @apply bg-grey-800 absolute block text-grey-100 left-full -mt-10 w-max max-w-80;
}

.fix-when-emergency {
  margin-top: -6rem !important;
}

.emergency {
  @apply border-t-2 border-[#202220];
}
</style>
