<template>
  <div class="flex-col gap-3">
    <div>
      <label>Earner*</label>
      <MInput
        v-model="list"
        data-test="earners-input"
        :errors="props.modelValueErrors"
        list="earners-datalist"
        class="earner-input" />
      <datalist id="earners-datalist">
        <option
          v-for="earner in listStore.earners"
          :key="String(earner)"
          :value="earner.account" />
      </datalist>
    </div>

    <div>
      <label>Claimant*</label>
      <MInput
        v-model="value"
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
  import { generateKeyEarnerClaimant } from '@/lib/api/utils'
  import { isAddress } from 'viem'

  export interface InputProps {
    modelValue: string
    modelValue2: string
    modelValueErrors?: ErrorObject[]
    modelValue2Errors?: ErrorObject[]
  }

  const listStore = useListsStore()

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue', 'update:modelValue2'])

  const list = ref()
  const key = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const value = useVModelWrapper<InputProps>(props, emit, 'modelValue2')

  watch(list, (value) => {
    try {
      if (isAddress(value)) key.value = generateKeyEarnerClaimant(value)
    } catch (e) {
      console.error(e)
    }
  })
</script>

<style>
  [list]::-webkit-calendar-picker-indicator {
    display: none !important;
  }
</style>
