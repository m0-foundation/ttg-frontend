<template>
  <div class="w-full flex justify-between items-center space-x-4">
    <div class="block w-1/3">
      <MInput
        v-model="from"
        class="input"
        type="number"
        placeholder="From"
        data-test="proposalValue"
        :errors="props.modelValueErrors" />
    </div>
    <div class="block w-1/3">
      <MInput
        v-model="to"
        class="input"
        type="number"
        placeholder="To"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors" />
    </div>
    <div class="block w-1/3">
      <MInput
        v-model="fee"
        class="input"
        type="number"
        placeholder="New Fee"
        data-test="proposalValue3"
        :errors="props.modelValue3Errors" />
    </div>
  </div>

  <div v-if="props.currentValue" class="text-xs text-grey-400 my-2">
    Current: {{ props.currentValue }}
  </div>
</template>

<script setup lang="ts">
  import { ErrorObject } from '@vuelidate/core'

  export interface InputProps {
    currentValue: string
    modelValue: number
    modelValue2: number
    modelValue3: number
    modelValueErrors?: ErrorObject[]
    modelValue2Errors?: ErrorObject[]
    modelValue3Errors?: ErrorObject[]
  }

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue', 'update:modelValue2'])

  const from = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const to = useVModelWrapper<InputProps>(props, emit, 'modelValue2')
  const fee = useVModelWrapper<InputProps>(props, emit, 'modelValue3')
</script>
