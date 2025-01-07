<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.9963 -0.000732422C18.6217 -0.000732422 23.9926 5.37218 23.9926 12C23.9926 18.6278 18.6217 24.0008 11.9963 24.0008C5.37092 24.0008 0 18.6278 0 12C0 5.37218 5.37092 -0.000732422 11.9963 -0.000732422ZM12.0198 7.89044L15.3541 14.3998L17.0405 13.6202L13.1312 6H10.87L6.96074 13.6202L8.55127 14.3998L11.8856 7.89044H12.0198Z"
      :fill="fill"
    />
  </svg>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

export interface IconProps {
  version?: "light" | "dark";
}

const colors = {
  dark: "#EBEBEB",
  light: "#000D0A",
};

const props = withDefaults(defineProps<IconProps>(), {
  version: undefined,
});

const fill = computed(() =>
  props.version
    ? colors[props.version]
    : colors[colorMode.value as "light" | "dark"],
);
</script>
