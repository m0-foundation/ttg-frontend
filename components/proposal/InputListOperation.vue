<template>
  <div class="flex-col gap-3">
    <div>
      <label>Role *</label>
      <ProposalSelectList
        v-model="list"
        data-test="listSelect"
        :errors="props.modelValueErrors" />
    </div>

    <div>
      <label>Address *</label>
      <MInput
        v-model="address"
        class="input"
        type="text"
        data-test="proposalValue2"
        :errors="props.modelValue2Errors"
        data-1p-ignore />
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

  const list = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const address = useVModelWrapper<InputProps>(props, emit, 'modelValue2')
</script>

<style>
  .error {
    @apply border border-red-500;
  }
</style>
