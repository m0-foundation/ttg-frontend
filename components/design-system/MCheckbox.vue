<template>
  <label class="checkbox-container">
    <slot />
    <input
      id="m-checkbox"
      :checked="modelValue"
      type="checkbox"
      @change="updateInput" />
    <span class="checkbox-checkmark"></span>
  </label>
</template>

<script setup>
  const emit = defineEmits(['update:modelValue'])

  defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  })

  const updateInput = ($event) => {
    emit('update:modelValue', $event.target.checked)
  }
</script>

<style scoped>
  .checkbox-container {
    display: block;
    position: relative;
    padding-left: 24px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .checkbox-container input {
    @apply absolute opacity-0 cursor-pointer h-0 w-0;
  }

  .checkbox-checkmark {
    @apply absolute h-4 w-4 top-0 left-0 border border-grey-500;
  }

  .checkbox-container:hover input ~ .checkbox-checkmark {
    @apply bg-transparent border border-grey-500;
  }

  .checkbox-container input:checked ~ .checkbox-checkmark {
    @apply bg-green-700;
  }
  .checkbox-checkmark:after {
    content: '';
    @apply absolute hidden;
  }

  .checkbox-container input:checked ~ .checkbox-checkmark:after {
    display: block;
  }
  .checkbox-container .checkbox-checkmark:after {
    left: 5px;
    top: 2.5px;
    width: 4px;
    height: 8px;
    @apply border border-grey-500;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
