<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/2">
      <MInput
        v-model="name"
        class="input"
        type="text"
        placeholder="Config Name"
        data-test="proposalValue"
        :errors="props.modelValueErrors" />
    </div>

    <div class="block w-1/2">
      <MInput
        v-model="value"
        class="input"
        type="text"
        placeholder="Config Value"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ErrorObject } from '@vuelidate/core'

  export interface InputProps {
    modelValue: string
    modelValue2: string
    modelValueErrors?: ErrorObject[]
    modelValue2Errors?: ErrorObject[]
  }

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue', 'update:modelValue2'])

  const name = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const value = useVModelWrapper<InputProps>(props, emit, 'modelValue2')
</script>
