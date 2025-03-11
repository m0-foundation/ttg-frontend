<template>
  <div>
    <div>
      <MInputMultiSelect
        v-model="list"
        :options="options"
        :class="{ error: hasErrors }"
        @on-change="handleChangeList" />
    </div>

    <div class="text-red-500 text-xs my-2 h-4">
      <p v-for="error of props.errors" :key="error.$uid">
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ErrorObject } from '@vuelidate/core'

  const options = [
    {
      value: 'guidance',
      label: 'Adopted guidance',
      id: 'adopted_guidance',
    },
    {
      value: 'ecosystem_guidance',
      label: 'Ecosystem guidance',
      id: 'ecosystem_guidance',
    },
    {
      value: 'collateral_guidance',
      label: 'Collateral guidance',
      id: 'collateral_guidance',
    },

    {
      value: 'spv_operators_guidance',
      label: 'SPV operators guidance',
      id: 'spv_operators_guidance',
    },
    {
      value: 'validators_guidance',
      label: 'Validators guidance',
      id: 'validators_guidance',
    },
    {
      value: 'minters_guidance',
      label: 'Minters guidance',
      id: 'minters_guidance',
    },
    {
      value: 'mandatory_contract_guidance',
      label: 'Mandatory contract guidance',
      id: 'mandatory_contract_guidance',
    },
  ]

  export interface InputProps {
    modelValue: string
    errors?: ErrorObject[]
  }

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue'])

  const list = useVModelWrapper<InputProps>(props, emit, 'modelValue')

  const hasErrors = computed(() => props.errors?.length)

  function handleChangeList(e: any) {
    list.value = e.value
  }
</script>

<style>
  .error {
    @apply border border-red-500;
  }
</style>
