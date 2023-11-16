<template>
  <div class="flex flex-col h-full">
    <LayoutHeader
      class="w-full bg-grey-900 lg:hidden fixed lg:static"
      :sidebar-open="isSidebarOpen"
      @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
    />
    <div class="flex flex-col app-content">
      <div class="flex grow gap-4">
        <aside :class="{ '!block': isSidebarOpen }">
          <LayoutSidebar class="h-screen w-full" />
        </aside>
        <main class="w-full lg:mx-20 xl:mx-40 overflow-x-hidden lg:p-6 lg:pt-0">
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
  { deep: true, immediate: true }
);
</script>

<style scoped>
aside {
  @apply z-30 fixed lg:static w-full h-screen lg:h-auto lg:min-w-[280px] lg:w-auto overflow-y-scroll lg:overflow-y-visible p-6 pt-0 lg:pl-16 hidden lg:block bg-grey-900;
}
.app-content {
  height: calc(100vh);
}
</style>
