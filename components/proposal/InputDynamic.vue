<template>
  <UCard
    v-if="props.description"
    class="bg-grey-200 dark:bg-grey-800 flex flex-col gap-1 my-2">
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

    <div v-else-if="props.currentValue" class="text-xs text-grey-600 my-2">
      Current: {{ props.currentValue }}
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
</script>

<style scoped>
  .error {
    @apply bg-transparent border border-red-500;
  }
</style>
