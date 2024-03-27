<template>
  <div class="flex items-center gap-2 font-inter">
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
      v-if="amount"
      v-bind="$attrs"
      class="text-white"
      :style="`font-size: ${size}px; line-height: normal`"
      :data-test="`${name?.toLocaleLowerCase()}-token-available`"
      >{{ amount }}</span
    >
    <span v-else class="text-grey-400">-</span>
  </div>
</template>

<script setup lang="ts">
interface MTokenAmountProps {
  image: string;
  amount?: string | number | undefined;
  size: number;
  name: string | null;
}

const props = withDefaults(defineProps<MTokenAmountProps>(), {
  image: "",
  size: 40,
  amount: undefined,
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
