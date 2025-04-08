<template>
  <div class="flex-col gap-3">
    <div>
      <label>Guidance Type *</label>
      <ProposalSelectListGuidance
        v-model="list"
        data-test="guidance-types-select"
        :errors="props.modelValueErrors" />
    </div>

    <div>
      <label>Hash *</label>

      <MInput
        v-model="hash"
        class="input"
        type="text"
        placeholder="SHA256 hash of the guidance .pdf document"
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

  const list = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const hash = useVModelWrapper<InputProps>(props, emit, 'modelValue2')
</script>
