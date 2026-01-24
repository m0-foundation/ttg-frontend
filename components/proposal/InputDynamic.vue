<template>
  <UCard
    v-if="props.description"
    class="bg-slate-100 dark:bg-grey-800 flex flex-col gap-1 my-2 shadow-none">
    <label>Parameter description</label>
    <p class="font-inter">
      {{ props.description }}
    </p>
  </UCard>

  <div class="my-3 mb-4">
    <label for="governance-config-input">Value *</label>

    <UInput
      v-bind="$attrs"
      v-model="value"
      v-maska
      :data-maska="props.maska?.mask"
      :data-maska-tokens="props.maska?.tokens"
      :class="{ error: hasErrors }"
      :trailing="props.decorator"
      size="lg">
      <template #trailing>
        <span class="text-gray-500 dark:text-gray-400 text-xs">
          {{ props.decorator }}
        </span>
      </template>
    </UInput>

    <div
      v-if="props.modelValueErrors?.length"
      class="text-red-500 text-xs my-2 h-4 font-inter">
      <p v-for="error of props.modelValueErrors" :key="error.$uid">
        {{ error.$message }}
      </p>
    </div>

    <div
      v-else-if="props.currentValue && props.decorator === '%'"
      class="text-xs text-grey-600 my-2">
      Current: {{ props.currentValue }}
    </div>
    <div
      v-else-if="props.currentValue && props.decorator === 'contract'"
      class="text-xs text-grey-600 my-2">
      Current: {{ props.currentValue }}
    </div>
    <div
      v-else-if="props.currentValue && props.decorator != null"
      class="text-xs text-grey-600 my-2">
      Current: {{ formattedValueCurrent(props.decorator) }} ({{
        props.currentValue
      }}) | New value:
      <strong>{{ formattedValue(props.decorator) }}</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ErrorObject } from '@vuelidate/core'

  export interface InputProps {
    description?: string
    currentValue?: string
    decorator?: string
    maska?: {
      mask: string
      tokens?: string
    }
    modelValue: any
    modelValueErrors?: ErrorObject[]
  }

  const props = defineProps<InputProps>()
  const emit = defineEmits(['update:modelValue'])
  const value = useVModelWrapper<InputProps>(props, emit, 'modelValue')
  const hasErrors = computed(() => props.modelValueErrors?.length)

  const formattedValue = (decorator?: string) => {
    if (!props.decorator) return
    if (value.value == null || value.value == undefined || value.value == 0)
      return `-`
    if (props.decorator === 'BPS') {
      return `${basisPointsToPercentage(value.value)}%`
    } else if (props.decorator === 'seconds') {
      return `${value.value >= 7200 ? value.value / 3600 + ' hours' : value.value / 60 + ' minutes'}`
    } else {
      return `${value.value}`
    }
    return
  }
  const formattedValueCurrent = (decorator?: string) => {
    if (!props.decorator) return
    const current = Number(props.currentValue)
    if (props.decorator === 'BPS') {
      return `${basisPointsToPercentage(current)}%`
    } else if (props.decorator === 'seconds') {
      return `${current >= 7200 ? current / 3600 + ' hours' : current / 60 + ' minutes'}`
    } else {
      return `${current}`
    }
    return
  }
</script>

<style scoped>
  .error {
    @apply bg-transparent border border-red-500;
  }
</style>
