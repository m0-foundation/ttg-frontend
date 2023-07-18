<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      ref="modal-backdrop"
      class="fixed z-10 inset-0 overflow-y-auto bg-body-dark"
    >
      <div class="flex items-start justify-center min-h-screen pt-24">
        <div class="p-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/2">
          <div class="flex flex-wrap flex-col shadow-xl">
            <button class="p-4 border text-white mb-2 self-end" @click="close">
              x
            </button>

            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
const isOpen = ref(false);

const emit = defineEmits<{
  (e: "onClosed"): void;
  (e: "onOpened"): void;
}>();

function open(): void {
  console.log("open");
  isOpen.value = true;
  emit("onOpened");
}

function close(): void {
  console.log("close");
  isOpen.value = false;
  emit("onClosed");
}

defineExpose({ open, close });
</script>
