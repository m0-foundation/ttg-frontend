<template>
  <VDropdown placement="bottom-start">
    <button
      type="button"
      class="border border-grey-700 bg-grey-800 py-2 px-4 flex justify-between w-full items-center font-inter gap-2"
      @click="onOpen"
    >
      <span class="h-6 text-nowrap">{{
        selected?.label || props.label || " "
      }}</span>
      <div class="flex items-center gap-3 h-full">
        <ProposalTypeBadge
          v-if="selected?.isEmergency || selected?.isReset"
          :type="selected.votingType"
        />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="9"
          height="5"
          viewBox="0 0 9 5"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.99996 0.000453115L4.75732 4.24309L0.514684 0.000453115H8.99996Z"
            fill="#EBEBEB"
          />
        </svg>
      </div>
    </button>
    <template #popper>
      <ul class="dropdown-menu-items">
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
            <VDropdown
              v-if="opt.children"
              :placement="largerThanSm ? 'right-end' : 'auto'"
            >
              <button type="button" class="button">
                {{ opt.label }} &rsaquo;
              </button>
              <template #popper>
                <ul class="dropdown-menu-items max-w-80">
                  <li
                    v-if="opt.submenuText"
                    class="bg-blue-700 text-grey-200 p-4 text-xs"
                  >
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
                        <div>
                          <MIconPower
                            v-if="
                              ['Standard', 'Emergency'].includes(
                                child.votingType,
                              )
                            "
                          />
                          <MIconZero
                            v-if="['Zero'].includes(child.votingType)"
                          />
                        </div>
                      </div>
                    </button>
                  </li>
                </ul>
              </template>
            </VDropdown>

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

              <div>
                <MIconPower
                  v-if="['Standard', 'Emergency'].includes(opt.votingType)"
                  class="w-[24px] h-[24px]"
                />
                <MIconZero
                  v-if="['Zero'].includes(opt.votingType)"
                  class="w-[24px] h-[24px]"
                />
              </div>
            </button>
          </div>
        </li>
      </ul>
    </template>
  </VDropdown>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { hideAllPoppers } from "floating-vue";

const largerThanSm = useBreakpoints(breakpointsTailwind).greater("sm");

export interface OptionItem {
  value: string;
  label: string;
  component: any;
  description: string;
  id: string;
  shortDescription: string;
  votingType: "Standard" | "Emergency" | "Zero";
  header?: string;
  isEmergency?: boolean;
  isReset?: boolean;
  children?: Array<{
    value: string;
    label: string;
    isEmergency: boolean;
    component: any;
    votingType: "Standard" | "Emergency" | "Zero";
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
  hideAllPoppers();
}
</script>
<style scoped>
.button {
  @apply font-inter text-left w-full py-2 px-4 hover:bg-grey-600;
}

.sub-button {
  @apply hover:bg-grey-600 px-4 py-2;
}

.fix-when-emergency {
  margin-top: -6rem !important;
}

.emergency {
  @apply border-t-2 border-[#202220];
}
.dropdown-menu-items {
  @apply bg-grey-800 text-grey-200 !important;
}
</style>
