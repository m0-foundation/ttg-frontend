<template>
  <div class="bg-grey-900">
    <div class="p-4">
      <h2 class="text-white text-2xl text-center">{{ title }}</h2>
    </div>
    <ol class="space-y-4 m-8">
      <li v-for="(step, index) in steps" :key="index">
        <div :class="['step', step.status]" role="alert">
          <div class="flex gap-6">
            <div>
              <h3 class="font-medium flex text-grey-200">
                <span v-if="step.status === 'complete'">[⎷]</span>
                <span v-else-if="step.status === 'error'">[x]</span>
                <span v-else-if="step.status === 'pending'" class="flex">
                  [
                  <svg
                    v-show="['current', 'pending'].includes(step.status)"
                    class="animate-spin mx-1 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      stroke="currentColor"
                      stroke-width="4"
                      cx="12"
                      cy="12"
                      r="10"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ]
                </span>
                <span v-else>[{{ index + 1 }}]</span>
              </h3>
            </div>
            <div>
              <h3 class="text-grey-100">
                {{ step.title }}
              </h3>
              <p
                v-if="index === currentStep"
                class="text-sm text-grey-200 font-inter mb-0">
                {{ step.message ? step.message : messages[step.status] }}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
  type Status = 'complete' | 'incomplete' | 'current' | 'pending' | 'error'
  interface Step {
    title: string
    status: Status
    message: string
  }
  export interface Props {
    title: string
    steps: Array<Step>
  }

  const props = withDefaults(defineProps<Props>(), {})

  const currentStep = ref(0)
  let steps = computed(() => [...props.steps])

  const messages = {
    current: 'Open your wallet and confirm the transaction...',
    pending: 'Waiting the transaction to be confirmed...',
    complete: 'Action was succesfully confirmed.',
    error: 'Failed to confirm the transaction.',
  }

  function nextStep() {
    steps.value[currentStep.value].status = 'complete'
    currentStep.value += 1
    steps.value[currentStep.value].status = 'current'
  }

  function changeCurrentStep(newStatus: Status) {
    steps.value[currentStep.value].status = newStatus
  }

  function reset() {
    steps = computed(() => [...props.steps])
    currentStep.value = 0
  }

  defineExpose({ nextStep, changeCurrentStep, reset })

  onUnmounted(() => {
    reset()
  })
</script>
<style scoped>
  h3 {
    @apply text-xl;
  }
  .step {
    @apply w-full p-2;
  }

  .complete {
    @apply text-green-700;
  }

  .incomplete {
    @apply text-grey-400;
  }

  .current {
    @apply text-white;
  }

  .pending {
    @apply text-white;
  }
  .error {
    @apply text-white bg-red-500;
  }
  .error span {
    @apply !text-white;
  }
</style>
