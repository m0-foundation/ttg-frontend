<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div>
      <button class="text-green-800 uppercase mb-4" @click="onBack">
        &#60; back
      </button>
    </div>
    <h1>Preview your proposal</h1>

    <MTextLoop class="text-green-900 bg-green-700 text-sm" text="PREVIEW" />

    <div class="bg-white p-6 lg:px-16 lg:py-8 mb-4">
      <div class="text-green-900 text-xs lg:text-base">
        <p v-if="address" class="overflow-hidden text-ellipsis">
          Proposed by
          <MAddressAvatar :address="address" />
        </p>
      </div>
      <div class="markdown-body" v-html="descriptionHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Hash } from "viem";
import { marked } from "marked";
import xss from "xss";
import { computed } from "vue";
const emit = defineEmits(["on-back"]);

interface PreviewProps {
  address?: Hash;
  description: String;
}

const props = defineProps<PreviewProps>();

const descriptionHtml = computed(() => {
  return xss(marked.parse(props.description));
});

function onBack() {
  // emit isPreview
  console.log("back");
  emit("on-back");
}
</script>

<style scoped>
h1 {
  @apply text-3xl font-light mb-12;
}

.markdown-body {
  box-sizing: border-box;
}
</style>
