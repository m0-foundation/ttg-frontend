<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M21.9926 12C21.9926 6.47715 17.5171 2 11.9963 2C6.47549 2 2 6.47715 2 12C2 17.5228 6.47549 22 11.9963 22C17.5171 22 21.9926 17.5228 21.9926 12ZM3 12C3 7.02935 7.02786 3 11.9963 3C16.9647 3 20.9926 7.02935 20.9926 12C20.9926 16.9706 16.9647 21 11.9963 21C7.02786 21 3 16.9706 3 12Z"
      fill="#EBEBEB"
    />
    <path d="M15 8V9L10.3349 14H15V15H9V14L13.6794 9H9V8H15Z" fill="#EBEBEB" />
  </svg>
</template>

<script lang="ts" setup>
export interface MButtonProps {
  version: "light" | "dark";
}

const props = withDefaults(defineProps<MButtonProps>(), {
  version: "light",
});

const fill = computed(() =>
  props.version === "light" ? "#EBEBEB" : "#868886"
);
</script>
