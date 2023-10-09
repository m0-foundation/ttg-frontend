<template>
  <div>
    <div class="flex">
      <div
        class="fixed flex items-center space-x-4 top-5 right-10 lg:hidden z-50"
      >
        <button class="bg-black" @click="isSidebarOpen = !isSidebarOpen">
          <span class="sr-only">Toggle main manu</span>
          <span aria-hidden="true">
            <svg
              v-show="!isSidebarOpen"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="47" height="47" stroke="white" />
              <path
                d="M16.2051 17.5H31.7949"
                stroke="white"
                stroke-linecap="square"
              />
              <path
                d="M16.2051 23.5H31.7949"
                stroke="white"
                stroke-linecap="square"
              />
              <path
                d="M16.2051 29.5H31.7949"
                stroke="white"
                stroke-linecap="square"
              />
            </svg>

            <svg
              v-show="isSidebarOpen"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="47" height="47" stroke="white" />
              <path
                d="M18.4881 17.9882L29.5118 29.0118"
                stroke="white"
                stroke-linecap="square"
              />
              <path
                d="M18.4882 28.5118L29.5118 17.4882"
                stroke="white"
                stroke-linecap="square"
              />
            </svg>
          </span>
        </button>
      </div>
      <aside :class="{ '!block': isSidebarOpen }">
        <LayoutSidebar />
      </aside>
      <main class="flex-1 ml-0 lg:mr-10 lg:ml-80 lg:p-8 overflow-x-hidden">
        <NuxtPage />
      </main>
    </div>

    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
</script>

<style scoped>
aside {
  @apply z-40 w-full lg:w-80 fixed left-0 top-0 h-screen p-10 hidden lg:block bg-body-dark shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)];
}
</style>
