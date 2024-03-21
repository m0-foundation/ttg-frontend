<script setup>
const tabContainer = ref(null);
const tabHeaders = ref(null);
const tabs = ref(null);
const activeTabIndex = ref(0);

onMounted(() => {
  tabs.value = [...tabContainer.value.querySelectorAll(".m-tab")];
  tabs.value[0].classList.add("active-tab");
  for (const x of tabs.value) {
    if (x.classList.contains("active-tab")) {
      activeTabIndex.value = tabs.value.indexOf(x);
    }
  }
});
const changeTab = (index) => {
  for (const x of [...tabs.value, ...tabHeaders.value]) {
    x.classList.remove("active-tab");
  }
  tabs.value[index].classList.add("active-tab");
  tabHeaders.value[index].classList.add("active-tab");
};
</script>

<template>
  <div id="tabs-container" ref="tabContainer" :class="customClass">
    <div id="tab-headers">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          :key="index"
          ref="tabHeaders"
          :class="activeTabIndex == index ? 'active-tab' : ''"
          @click="changeTab(index)"
        >
          {{ tab.title }}
        </li>
      </ul>
    </div>
    <div id="active-tab">
      <slot></slot>
    </div>
  </div>
</template>

<style>
#tab-headers ul {
  margin: 0;
  padding: 0;
  display: flex;
}
#tab-headers ul li {
  list-style: none;
  padding: 1rem 1.25rem;
  @apply text-grey-500 cursor-pointer relative first-of-type:pl-0;
}
#tab-headers ul li.active-tab {
  @apply text-grey-200;
}

#tab-headers ul li.active-tab:after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  height: 2px;
  width: 100%;
}
#active-tab,
#tab-headers {
  width: 100%;
}
</style>
