<template>
  <div class="flex flex-col h-full">
    <LayoutHeader
      class="w-full bg-grey-900 lg:hidden fixed lg:static"
      :sidebar-open="isSidebarOpen"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />
    <div class="flex flex-col h-dvh">
      <div class="flex grow xl:gap-6">
        <aside :class="{ '!block': isSidebarOpen }">
          <LayoutSidebar />
        </aside>
        <main
          :class="{ '!hidden': isSidebarOpen }"
          class="w-full lg:max-w-[1100px] overflow-x-hidden lg:p-6 pt-24 lg:pt-12"
        >
          <LayoutAlerts />
          <NuxtPage />
        </main>
      </div>
      <LayoutFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);

const route = useRoute();

watch(
  () => route.path,
  () => {
    isSidebarOpen.value = false;
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
aside {
  @apply fixed lg:static w-full h-screen lg:h-auto lg:min-w-[280px] lg:w-auto overflow-hidden  p-6 pt-0 lg:pl-16 hidden lg:block bg-grey-900;
}
</style>
