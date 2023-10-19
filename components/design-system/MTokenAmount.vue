<template>
  <div class="flex items-center gap-2">
    <img
      v-if="image"
      :src="image"
      :style="`height: ${size}px; width: ${size}px`"
      :alt="`${name} token logo`"
    />
    <div
      v-else-if="name"
      :title="`${name} token logo`"
      class="no-token text-white"
      :style="`width: ${size}px; height: ${size}px;`"
    >
      <span class="uppercase" :style="`font-size: ${size * 0.7}px`">{{
        name.charAt(index)
      }}</span>
    </div>
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
  name: string | null;
}

const props = withDefaults(defineProps<MTokenAmountProps>(), {
  image: "",
  amount: null,
  size: 40,
  name: "",
});

const { amount, image, name, size } = toRefs(props);
</script>

<style scoped>
.no-token {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  border: white 1px solid;
  border-radius: 50%;
}
</style>
