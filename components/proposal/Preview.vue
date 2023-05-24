<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <div>
      <button class="text-primary-dark uppercase mb-4" @click="onBack">
        &#60; back
      </button>
    </div>
    <h1>Preview your proposal</h1>

    <MTextLoop class="text-primary-darker bg-primary text-sm" text="PREVIEW" />

    <div class="bg-white px-16 py-8 mb-4">
      <h2>proposal.title</h2>
      <div class="text-primary-darker">Proposed by 0x....</div>
      <div class="markdown-body" v-html="descriptionHtml"></div>
    </div>
  </div>
</template>

<script setup>
import { marked } from "marked";
import xss from "xss";
import { computed } from "vue";
const emit = defineEmits(["on-back"]);

const props = defineProps({
  description: {
    type: String,
    default: "",
  },
});

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
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
}
</style>
