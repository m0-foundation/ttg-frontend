<template>
  <div class="z-50 shadow-lg alert">
    <div class="items-stretch flex flex-col px-4" :class="color">
      <div
        class="text-gray-200 text-xs leading-3 uppercase whitespace-nowrap mt-5 max-md:max-w-full justify-between flex gap-2"
      >
        <span>{{ title }}</span>

        <button class="hover:opacity-70" @click="dismiss">X</button>
      </div>
      <div
        class="flex justify-between items-center align-middle gap-2 mt-4 mb-4 max-md:max-w-full max-md:flex-wrap"
      >
        <component
          :is="Icon"
          class="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full fill-white"
        />

        <p
          class="text-gray-200 text-base items-center align-middle leading-6 self-stretch grow shrink basis-auto max-md:max-w-full font-bold"
        >
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MIconAlert from "./MIconAlert.vue";
import MIconCheck from "./MIconCheck.vue";

export interface Props {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  dismiss: [id: string];
}>();

const title = computed(() => {
  return props.type === "error" ? "Error" : "Success";
});

const Icon = computed(() => {
  return props.type === "error" ? MIconAlert : MIconCheck;
});

const color = computed(() => {
  return props.type === "error" ? "bg-red-500" : "bg-green-900";
});

function dismiss() {
  emit("dismiss", props.id);
}
</script>

<style>
@keyframes enterFromRightToLeft {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(0);
  }
  40% {
    transform: translateX(-30px);
  }
}

.alert {
  animation-name: enterFromRightToLeft, bounce;
  animation-duration: 0.5s;
  animation-fill-mode: both;
}
</style>
