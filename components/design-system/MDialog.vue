<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-backdrop">
      <div
        class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription">
        <header id="modalTitle" class="modal-header">
          <slot name="header">Please confirm</slot>
        </header>

        <section id="modalDescription" class="modal-body">
          <slot name="body" />
        </section>

        <footer class="modal-footer">
          <button
            class="border border-white px-2 py-1 hover:bg-grey-800"
            data-test="dialog-button-cancel"
            @click="cancel">
            Cancel
          </button>
          <MButton data-test="dialog-button-confirm" @click="agree">
            Confirm
          </MButton>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script setup>
  const emit = defineEmits(['cancel', 'agree'])
  const show = ref(false)

  let confirmResolve

  const agree = () => {
    confirmResolve(true)
    emit('agree')
    show.value = false
  }

  const cancel = () => {
    confirmResolve(false)
    emit('cancel')
    show.value = false
  }

  const open = () => {
    show.value = true

    return new Promise((resolve) => {
      confirmResolve = resolve
    })
  }

  defineExpose({ open })
</script>

<style>
  .modal-backdrop {
    position: fixed;
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    position: relative;
    background: black;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    min-height: 250px;
    @apply border border-grey-800;
  }

  .modal-header,
  .modal-footer {
    padding: 4px 20px;
    display: flex;
  }

  .modal-header {
    position: relative;
    @apply bg-green-800 text-white text-2xl justify-between flex border-b border-b-gray-800 w-full p-4;
  }

  .modal-footer {
    position: absolute;
    bottom: 0px;
    @apply justify-between flex border-t border-t-gray-800 w-full p-4;
  }

  .modal-body {
    position: relative;
    @apply p-4;
  }

  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.2s ease;
  }
</style>
