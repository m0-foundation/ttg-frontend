<template>
  <div>
    <Head>
      <Link rel="stylesheet" href="/github-markdown.css"></Link>
    </Head>
    <div>
      <button class="text-primary-dark" @click="onBack">back</button>
    </div>
    <h1>Preview your proposal</h1>

    <div class="text-black bg-primary-dark">PREVIEW</div>

    <div class="bg-white px-16 py-8">
      <h2>proposal.title</h2>
      <div class="text-primary">Proposed by 0x....</div>
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
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
}
</style>
