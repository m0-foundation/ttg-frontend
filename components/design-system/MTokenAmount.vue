<template>
  <div class="flex gap-2">
    <img :src="image" :style="`height: ${size}px; width: ${size}px`" alt="" />
    <span
      v-bind="$attrs"
      class="text-white"
      :style="`font-size: ${size}px; line-height: normal`"
      >{{ amount }}</span
    >
  </div>
</template>

<script setup lang="ts">
interface MTokenAmountProps {
  image: string;
  amount: string | null;
  size: number | null;
}

const props = withDefaults(defineProps<MTokenAmountProps>(), {
  image: "",
  amount: null,
  size: 40,
});

const { image, amount, size } = toRefs(props);
</script>
