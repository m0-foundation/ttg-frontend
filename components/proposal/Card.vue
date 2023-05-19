<template>
  <article class="bg-white text-black p-8 mb-2">
    <h2 class="text-2xl">{{ title }}</h2>
    <div class="text-primary-darker text-sm mb-6">
      Proposed by <u>{{ proposer }}</u>
    </div>
    <!-- <div class="mb-6">{{ description }}</div> -->
    <div class="markdown-body mb-6" v-html="descriptionHtml"></div>
    <div class="flex justify-between uppercase">
      <button class="uppercase">Show Details</button>
      <div class="flex justify-between items-center">
        <div class="text-primary-darker text-sm mr-4">
          Active | participation rate
        </div>
        <div class="space-x-1">
          <MButton>YES</MButton>
          <MButton>NO</MButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { marked } from "marked";
import xss from "xss";

const props = defineProps({
  description: {
    type: String,
    default: "",
  },
  proposer: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
});

const title = props.description.split("\n")[0];

const descriptionHtml = computed(() => {
  return xss(marked.parse(props.description));
});
</script>

<style scoped></style>
