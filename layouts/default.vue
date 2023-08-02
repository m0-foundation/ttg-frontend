<template>
  <div>
    <div class="flex">
      <div class="fixed flex items-center space-x-4 top-5 right-10 lg:hidden">
        <button
          class="p-1 text-primary transition-colors duration-200 rounded-md bg-grey-secondary focus:outline-none focus:ring"
          @click="isSidebarOpen = !isSidebarOpen"
        >
          <span class="sr-only">Toggle main manu</span>
          <span aria-hidden="true">
            <svg
              v-show="!isSidebarOpen"
              class="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
            <svg
              v-show="isSidebarOpen"
              class="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </span>
        </button>
      </div>
      <aside :class="{ '!block': isSidebarOpen }">
        <LayoutSidebar />
      </aside>
      <main class="flex-1 ml-0 mr-10 lg:ml-80 p-8 overflow-x-hidden">
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
  @apply z-50 w-80 fixed left-0 top-0 h-screen p-10 hidden lg:block bg-body-dark shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)];
}
</style>
