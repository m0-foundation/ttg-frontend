<template>
  <div class="bg-white">
    <div class="p-4 border border-b-2">
      <h2 class="text-black text-xl">Creating Proposal</h2>
    </div>
    <ol class="space-y-4 m-8">
      <li v-for="(step, index) in currentSteps" :key="index">
        <div :class="['step', step.status]" role="alert">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">{{ index + 1 }}. {{ step.title }}</h3>

              <span class="text-sm text-gray-700">
                {{ messages[step.status] }}
              </span>
            </div>

            <svg
              v-show="['current', 'pending'].includes(step.status)"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                stroke="currentColor"
                stroke-width="4"
                cx="12"
                cy="12"
                r="10"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <svg
              v-show="step.status === 'complete'"
              aria-hidden="true"
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>

            <svg
              v-show="step.status === 'error'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
type Status = "complete" | "incomplete" | "current" | "pending" | "error";
interface Step {
  title: string;
  status: Status;
}
export interface Props {
  steps: Array<Step>;
}

const props = withDefaults(defineProps<Props>(), {});

const currentStep = ref(0);
let currentSteps = computed(() => [...props.steps]);

const messages = {
  current: "Open your wallet and confirm the transaction...",
  pending: "Waiting the transaction to be confirmed...",
  complete: "Action was succesfully confirmed.",
  error: "Failed to confirm the transaction.",
};

function nextStep() {
  currentSteps.value[currentStep.value].status = "complete";
  currentStep.value += 1;
  currentSteps.value[currentStep.value].status = "current";
}

function changeCurrentStep(newStatus: Status) {
  currentSteps.value[currentStep.value].status = newStatus;
}

function reset() {
  currentSteps = computed(() => [...props.steps]);
  currentStep.value = 0;
}

defineExpose({ nextStep, changeCurrentStep, reset });

onUnmounted(() => {
  console.log("unmounted");
  reset();
});
</script>
<style scoped>
.step {
  @apply w-full p-4 rounded-lg;
}

.complete {
  @apply text-green-700 border border-green-700 bg-green-50;
}

.incomplete {
  @apply text-gray-900 bg-gray-100 border border-gray-300;
}

.current {
  @apply text-blue-800 bg-blue-200 border border-primary-dark;
}

.pending {
  @apply text-black bg-yellow-200 border border-primary-dark;
}
.error {
  @apply text-red border border-red bg-rose-100;
}
</style>
