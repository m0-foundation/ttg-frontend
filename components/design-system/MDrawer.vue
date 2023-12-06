<template>
  <Teleport to="body">
    <Transition>
      <!-- drawer component -->
      <div
        v-show="isOpen"
        ref="drawer-backdrop"
        class="fixed bottom-0 z-50 w-full lg:w-1/2 lg:left-[50%] h-screen p-4 overflow-y-auto bg-white shadow-[0px_0px_0px_20px_rgba(0,0,0,0.3)] transition-transform"
        tabindex="-1"
        aria-labelledby="drawer-label"
      >
        <div class="w-full inline-flex items-center mb-4 justify-end">
          <button
            type="button"
            data-drawer-hide="drawer-example"
            aria-controls="drawer-example"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-12 h-12 inline-flex items-center justify-center"
            @click="close"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close menu</span>
          </button>
        </div>

        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const isOpen = ref(false);

const emit = defineEmits<{
  (e: "onClosed"): void;
  (e: "onOpened"): void;
}>();

function open(): void {
  isOpen.value = true;
  emit("onOpened");
}

function close(): void {
  isOpen.value = false;
  emit("onClosed");
}

defineExpose({ open, close });
</script>

<style scoped>
/* custo vue classes for transition built in component */
.v-enter-from,
.v-leave-to {
  @apply transition-all translate-x-full;
}
</style>
