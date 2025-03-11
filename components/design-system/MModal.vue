<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      ref="modal-backdrop"
      class="fixed z-40 inset-0 overflow-y-auto bg-grey-900">
      <div class="flex items-start justify-center min-h-screen pt-24">
        <div class="p-8 w-full md:w-1/2 lg:w-1/3 xl:w-1/2">
          <div class="flex flex-wrap flex-col">
            <slot />
          </div>
          <div class="px-8">
            <button
              class="border border-grey-100 text-grey-100 px-5 py-2 uppercase text-sm"
              @click="close">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  const isOpen = ref(false)

  const emit = defineEmits<{
    (e: 'onClosed'): void
    (e: 'onOpened'): void
  }>()

  function open(): void {
    isOpen.value = true
    emit('onOpened')
  }

  function close(): void {
    isOpen.value = false
    emit('onClosed')
  }

  defineExpose({ open, close })
</script>
