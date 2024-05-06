<template>
  <div class="z-50 shadow-lg alert">
    <div class="items-stretch flex flex-col px-4" :class="type">
      <div
        class="flex justify-between items-center align-middle gap-2 mt-4 mb-4 min-w-80 max-w-96 max-md:max-w-full max-md:flex-wrap"
      >
        <component
          :is="Icon"
          class="aspect-square object-contain object-center w-6 overflow-hidden shrink-0 max-w-full"
          :class="type"
        />

        <div
          class="text-base items-center align-middle leading-6 self-stretch grow shrink basis-auto max-md:max-w-full font-bold"
        >
          <div v-html="message" />
        </div>

        <div
          class="text-md leading-3 uppercase whitespace-nowrap ml-12 max-md:max-w-full justify-between flex gap-2"
        >
          <button class="hover:opacity-70" @click="dismiss">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import MIconAlert from "./MIconAlert.vue";
import MIconCheck from "./MIconCheck.vue";
import MIconInfo from "./MIconInfo.vue";

export interface Props {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

const props = defineProps<Props>();
const emit = defineEmits<{
  dismiss: [id: string];
}>();

const icons = {
  error: MIconAlert,
  success: MIconCheck,
  info: MIconInfo,
};

const Icon = computed(() => icons[props.type]);

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
  @apply font-inter;
}
.success {
  @apply bg-green-700 text-gray-900 fill-grey-900;
}

.error {
  @apply bg-red-500 text-white fill-white;
}

.info {
  @apply bg-accent-blue text-white fill-white;
}
</style>
