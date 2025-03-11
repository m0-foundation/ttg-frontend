<template>
  <div class="block">
    <MInput
      v-model="value"
      class="input"
      type="text"
      data-test="proposalValue"
      :placeholder="placeholder"
      :errors="props.modelValueErrors" />
  </div>
</template>

<script setup lang="ts">
  import { ErrorObject } from '@vuelidate/core'
  export interface InputProps {
    modelValue: string
    placeholder: string
    modelValueErrors?: ErrorObject[]
  }

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue'])

  const value = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })
</script>
