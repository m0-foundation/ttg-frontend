<template>
  <article class="bg-white text-black p-8 mb-2">
    <h2 class="text-4xl mb-4">
      {{ title }}
    </h2>
    <div class="text-primary-darker text-sm mb-6">
      Proposed by <u>{{ proposer }}</u>
    </div>
    <div class="markdown-body mb-6" v-html="descriptionShort"></div>
    <div class="flex justify-between uppercase">
      <NuxtLink class="uppercase" :to="`/proposals/${proposalId}`">
        Show Details
      </NuxtLink>

      <!-- <div class="flex justify-between items-center">
        <div class="text-primary-darker text-sm mr-4">
          Active | participation rate
        </div>
        <div class="space-x-1">
          <MButton>YES</MButton>
          <MButton>NO</MButton>
        </div>
      </div> -->
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  proposalId: {
    type: String,
    default: "",
  },
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

const { html } = useParsedDescription(props.description);
const domParser = new DOMParser();

const title = computed(() => {
  const dom = domParser.parseFromString(html, "text/html");
  const titleHtml = dom.getElementsByTagName("h1")[0];
  if (titleHtml) {
    return titleHtml.innerHTML;
  }
});

const descriptionShort = computed(() => {
  const dom = domParser.parseFromString(html, "text/html");
  const descriptionHtml = dom.getElementsByTagName("p")[0];
  if (descriptionHtml) {
    return descriptionHtml.innerHTML;
  }
});
</script>

<style scoped></style>
